import { Model, Query, Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';

import ObjectId = Schema.ObjectId;

interface PopulateObject {
  [key: string]: string;
}

interface SelectObject {
  [key: string]: number;
}

interface WhereObject {
  [key: string]: string | number | boolean;
}

interface Options {
  [key: string]: any;
}

export interface IPaginationMeta {
  pagination: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface IResponse {
  status: number;
  message: string;
  data: object | object[] | null | undefined;
  success: boolean;
  meta: IPaginationMeta | null | undefined;
}

export const Responses = {
  success: function (
    data: any,
    message: string = 'ok',
    total: number = 1,
    page: number = 1,
    per_page: number = 1,
  ): IResponse {
    return {
      status: 200,
      message: message,
      data,
      success: true,
      meta: {
        pagination: {
          total: total,
          page: page,
          per_page: per_page,
        },
      },
    };
  },
  notFound: function (message: string = 'Element not found'): IResponse {
    return {
      data: undefined,
      meta: undefined,
      status: 404,
      message: message,
      success: false,
    };
  },
  badRequest: function (message: string = 'Bad Request'): IResponse {
    return {
      data: undefined,
      meta: undefined,
      status: 400,
      message: message,
      success: false,
    };
  },
  internalServerError: function (
    message: string = 'Internal server error',
  ): IResponse {
    return {
      data: undefined,
      meta: undefined,
      status: 400,
      message: message,
      success: false,
    };
  },
};

@Injectable()
export abstract class ApiatoService<T, CreateDto, UpdateDto> {
  constructor(
    protected readonly model: Model<T>,
    protected options: Options,
  ) {
    if (!this?.options?.populationObject) {
      this.options.populationObject = {};
    }
  }

  // Function to create and return select fields in mongoose
  selectConstructor(select: string | SelectObject | undefined): any {
    let selector = {};
    if (select) {
      const ob: SelectObject = {};

      if (typeof select === 'string') {
        const fields = select.split(',');
        fields.forEach((item) => {
          ob[item] = 1;
        });
      } else if (typeof select === 'object') {
        for (const [key, val] of Object.entries(select)) {
          ob[key] = Number(val);
        }
      }

      selector = { ...ob };
    }
    return selector;
  }

  whereConstructor(where: WhereObject | undefined): WhereObject | undefined {
    if (where) {
      for (const [key, val] of Object.entries(where)) {
        if (!isNaN(Number(val))) {
          where[key] = Number(val);
          continue;
        }
        if (typeof val === 'boolean' || val === 'true' || val === 'false') {
          where[key] = Boolean(val);
          continue;
        }
      }
    }

    return where;
  }

  populateConstructor(
    populate: boolean | number | string | PopulateObject,
    populationObject: PopulateObject,
  ): any {
    const populateReturn = [];
    if (populate && populationObject) {
      if (
        (typeof populate === 'boolean' ||
          typeof populate === 'number' ||
          typeof populate === 'string') &&
        (Boolean(populate) === true || populate == 1)
      ) {
        for (const [key, value] of Object.entries(populationObject)) {
          populateReturn.push({
            path: key,
            model: value,
          });
        }
      }
      if (typeof populate === 'object') {
        for (const [key, value] of Object.entries(populate as PopulateObject)) {
          if (value && populationObject[key]) {
            populateReturn.push({
              path: key,
              model: populationObject[key],
            });
          }
        }
      }
    }
    return populateReturn;
  }

  async createOne(create: CreateDto, query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.createOnefIn_ &&
        typeof this?.options?.createManyfIn_ == 'function'
      ) {
        create = await this?.options.createOnefIn_(create);
      }
      const { populate, select } = query;

      let newElement: any = await this.model.create(create);

      const find = this.model.findById(newElement._id);
      const populate_ = this.populateConstructor(
        populate,
        this?.options?.populationObject,
      );
      const select_ = this.selectConstructor(select);
      newElement = await find.populate(populate_).select(select_).exec();

      if (
        this?.options?.createOnefOut_ &&
        typeof this?.options?.createOnefOut_ == 'function'
      ) {
        newElement = await this?.options?.createOnefOut_(newElement);
      }

      return Responses.success(newElement, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async createMany(create: CreateDto[], query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.createManyfIn_ &&
        typeof this?.options?.createManyfIn_ == 'function'
      ) {
        create = this?.options?.createManyfIn_(create);
      }
      const { populate, select } = query;

      let newElement: any = await this.model.insertMany(create);
      const newElementIds = newElement.map((item: any) => {
        return item._id;
      });

      console.log(newElementIds);
      const find = this.model.find({ _id: { $in: newElementIds } });
      const populate_ = this.populateConstructor(
        populate,
        this?.options?.populationObject,
      );
      const select_ = this.selectConstructor(select);
      newElement = await find.populate(populate_).select(select_).exec();
      console.log(newElement);

      if (
        this?.options?.createManyfOut_ &&
        typeof this?.options?.createManyfOut_ == 'function'
      ) {
        newElement = await this?.options?.createManyfOut_(newElement);
      }

      return Responses.success(newElement, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async getMany(query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.getManyfIn_ &&
        typeof this?.options?.getManyfIn_ == 'function'
      ) {
        query = await this?.options?.getManyfIn_(query);
      }

      const { whereObject, select, paginate, sort, populate } = query;
      let { where, like } = query;

      where = this.whereConstructor(where);
      like = this.whereConstructor(like);

      console.log(like);
      let find: any = {};
      if (like) {
        for (const [key, val] of Object.entries(like)) {
          find[key] = { $regex: String(val).trim(), $options: 'i' };
        }
      }
      if (where) {
        for (const [key, val] of Object.entries(where)) {
          find[key] = val;
        }
      }
      if (whereObject) {
        for (const [key, val] of Object.entries(whereObject)) {
          find[key] = new ObjectId(String(val));
        }
      }

      find = { ...find, deleteAt: null };
      const preview = this.model.find(find);
      const populate_ = this.populateConstructor(
        populate,
        this.options.populationObject,
      );
      const select_ = this.selectConstructor(select);

      if (paginate && paginate.limit && paginate.page) {
        paginate.limit = Number(paginate.limit);
        paginate.page = Number(paginate.page);
        preview.limit(paginate.limit).skip(paginate.page * paginate.limit);
      }
      if (sort) {
        const order: any = {};
        for (const [key, val] of Object.entries(sort)) {
          order[key] = val;
        }
        preview.sort(order);
      }

      let list_of_elements = await preview
        .populate(populate_)
        .select(select_)
        .exec();
      const full = await this.model.find().lean();
      if (
        this?.options?.getManyfOut_ &&
        this?.options?.getManyfOut_ == 'function'
      ) {
        list_of_elements = await this?.options?.getManyfOut_(list_of_elements);
      }

      return Responses.success(
        list_of_elements,
        'ok',
        full.length,
        paginate?.page,
        paginate?.limit || full.length,
      );
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async getOneById(id: string, query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.getOneByIdfIn_ &&
        typeof this?.options?.getOneByIdfIn_ == 'function'
      ) {
        query = await this?.options?.getOneByIdfIn_(query);
      }

      const { select, populate } = query;

      const find = this.model.findById(id, this?.options?.mongooseOptions);
      const populate_ = this.populateConstructor(
        populate,
        this?.options?.populationObject,
      );
      const select_ = this.selectConstructor(select);
      let newElement: any = await find
        .populate(populate_)
        .select(select_)
        .exec();

      if (!newElement || newElement.deleteAt != null) {
        return Responses.notFound();
      }
      if (
        this?.options?.getOneByIdfOut_ &&
        this?.options?.getOneByIdfOut_ == 'function'
      ) {
        newElement = await this?.options?.getOneByIdfOut_(newElement);
      }
      return Responses.success(newElement, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async getOneWhere(query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.getOneWherefIn_ &&
        typeof this?.options?.getOneWherefIn_ == 'function'
      ) {
        query = await this?.options?.getOneWherefIn_(query);
      }

      let { where, like } = query;
      const { whereObject, select, populate } = query;

      where = this.whereConstructor(where);
      like = this.whereConstructor(like);

      let find: any = {};

      if (like) {
        for (const [key, val] of Object.entries(like)) {
          find[key] = val;
        }
      }
      if (where) {
        for (const [key, val] of Object.entries(where)) {
          find[key] = val;
        }
      }
      if (whereObject) {
        for (const [key, val] of Object.entries(whereObject)) {
          find[key] = new ObjectId(String(val).trim());
        }
      }

      find = { ...find, deleteAt: null };
      const query_: any = this.model.findOne(
        find,
        this?.options?.mongooseOptions,
      );

      const populate_ = this.populateConstructor(
        populate,
        this.options.populationObject,
      );
      const select_ = this.selectConstructor(select);
      let newElement = await query_.populate(populate_).select(select_).exec();

      if (!newElement) {
        return Responses.notFound();
      }

      if (
        this?.options?.getOneWherefOut_ &&
        this?.options?.getOneWherefOut_ == 'function'
      ) {
        newElement = await this?.options?.getOneWherefOut_(newElement);
      }

      return Responses.success(newElement, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async findUpdateOrCreate(update: UpdateDto, query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.findUpdateOrCreatefIn_ &&
        typeof this?.options?.findUpdateOrCreatefIn_ == 'function'
      ) {
        query = await this?.options?.findUpdateOrCreatefIn_(query);
      }

      let { where } = query;
      const { whereObject, select, populate } = query;

      where = this.whereConstructor(where);

      const find: any = {};

      if (where) {
        for (const [key, val] of Object.entries(where)) {
          find[key] = val;
        }
      }
      if (whereObject) {
        for (const [key, val] of Object.entries(whereObject)) {
          find[key] = new ObjectId(String(val).trim());
        }
      }

      let query_: any = await this.model.findOne(
        find,
        this?.options?.mongooseOptions,
      );

      if (!query_) {
        query_ = new this.model({ ...find, ...update });

        query_ = await query_.save();
      }

      const plainUpdate = Object.assign({}, update);
      for (const [key, val] of Object.entries(plainUpdate)) {
        query_[key] = val;
      }
      query_.deletedAt = null;
      await query_.save();

      query_ = this.model.findById(query_._id, this?.options?.mongooseOptions);

      const populate_ = this.populateConstructor(
        populate,
        this.options.populationObject,
      );
      const select_ = this.selectConstructor(select);
      let newElement = await query_.populate(populate_).select(select_).exec();

      if (!newElement) {
        return Responses.notFound();
      }

      if (
        this?.options?.findUpdateOrCreatefOut_ &&
        this?.options?.findUpdateOrCreatefOut_ == 'function'
      ) {
        newElement = await this?.options?.findUpdateOrCreatefOut_(newElement);
      }

      return Responses.success(newElement, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async findUpdate(update: UpdateDto, query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.getOneWherefIn_ &&
        typeof this?.options?.getOneWherefIn_ == 'function'
      ) {
        query = await this?.options?.getOneWherefIn_(query);
      }

      let { where } = query;
      const { whereObject, select, populate } = query;

      where = this.whereConstructor(where);

      const find: any = {};

      if (where) {
        for (const [key, val] of Object.entries(where)) {
          find[key] = val;
        }
      }
      if (whereObject) {
        for (const [key, val] of Object.entries(whereObject)) {
          find[key] = new ObjectId(String(val).trim());
        }
      }

      let query_: any = await this.model.findOne(
        find,
        this?.options?.mongooseOptions,
      );

      if (!query_ || query_.deletedAt != null) {
        return Responses.notFound();
      }

      console.log(update);

      const plainUpdate = Object.assign({}, update);
      for (const [key, val] of Object.entries(plainUpdate)) {
        query_[key] = val;
      }

      await query_.save();

      query_ = this.model.findById(query_._id, this?.options?.mongooseOptions);

      const populate_ = this.populateConstructor(
        populate,
        this.options.populationObject,
      );
      const select_ = this.selectConstructor(select);
      let newElement = await query_.populate(populate_).select(select_).exec();

      if (!newElement) {
        return Responses.notFound();
      }

      if (
        this?.options?.getOneByIdfOut_ &&
        this?.options?.getOneByIdfOut_ == 'function'
      ) {
        newElement = await this?.options?.getOneByIdfOut_(newElement);
      }

      return Responses.success(newElement, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async updateById(
    update: UpdateDto,
    id: string,
    query: any,
  ): Promise<IResponse> {
    try {
      if (
        this?.options?.updateByIdfIn_ &&
        typeof this?.options?.updateByIdfIn_ == 'function'
      ) {
        query = await this?.options?.updateByIdfIn_(query);
      }

      const { select, populate } = query;

      let query_: any = await this.model.findById(
        id,
        this?.options?.mongooseOptions,
      );

      if (!query_ || query_.deletedAt != null) {
        return Responses.notFound();
      }

      const plainUpdate = Object.assign({}, update);
      for (const [key, val] of Object.entries(plainUpdate)) {
        query_[key] = val;
      }

      await query_.save();

      query_ = this.model.findById(id, this?.options?.mongooseOptions);

      const populate_ = this.populateConstructor(
        populate,
        this.options.populationObject,
      );
      const select_ = this.selectConstructor(select);
      let newElement = await query_.populate(populate_).select(select_).exec();

      if (!newElement) {
        return Responses.notFound();
      }

      if (
        this?.options?.updateByIdfOut_ &&
        this?.options?.updateByIdfOut_ == 'function'
      ) {
        newElement = await this?.options?.updateByIdfOut_(newElement);
      }

      return Responses.success(newElement, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }

  async findIdAndDelete(id: string, query: any): Promise<IResponse> {
    try {
      if (
        this?.options?.findIdAndDeletefIn_ &&
        typeof this?.options?.findIdAndDeletefIn_ == 'function'
      ) {
        query = await this?.options?.findIdAndDeletefIn_(query);
      }

      const { isLogic } = query;
      console.log(isLogic);
      let query_: any;
      if (isLogic) {
        const date = new Date().toDateString();
        query_ = await this.model.findById(id);
        query_.deletedAt = date;
        await query_.save();
      } else {
        query_ = await this.model.findByIdAndDelete(id);
      }

      if (!query_) {
        return Responses.notFound();
      }

      return Responses.success({}, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }
}

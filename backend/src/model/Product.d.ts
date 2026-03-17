import mongoose from "mongoose";
export declare const Product: mongoose.Model<{
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    slug: string;
    shortDescription: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
    isActive: boolean;
    displayOrder: number;
    imageUrl?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Product.d.ts.map
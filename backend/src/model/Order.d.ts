import mongoose from "mongoose";
export declare const Order: mongoose.Model<{
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
} & mongoose.DefaultTimestampProps, {
    id: string;
}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & Omit<{
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    giftMessage: string;
    items: mongoose.Types.DocumentArray<{
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, unknown, {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }, {}, {}> & {
        price: number;
        productId: string;
        productName: string;
        quantity: number;
    }>;
    totalAmount: number;
    status: "pending" | "confirmed" | "cancelled";
    paymentStatus: "awaiting_payment" | "paid" | "failed" | "refunded";
    paymentMethod: "pix" | "credit_card" | "payment_link" | "manual_redirect";
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Order.d.ts.map
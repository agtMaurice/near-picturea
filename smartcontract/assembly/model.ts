import { PersistentUnorderedMap, context, u128 } from "near-sdk-as";

/**
 * This class represents a book that can be listed on a marketplace.
 * It contains basic properties that are needed to define a book.
 * The price of the book is of type u128 that allows storing it in yocto-NEAR, where `1 yocto = 1^-24`.
 * {@link nearBindgen} - it's a decorator that makes this class serializable so it can be persisted on the blockchain level. 
 */
@nearBindgen
export class Picture {
    id: string;
    image: string;
    description: string;
    price: u128;
    owner: string;
    sold: u32;
    likes: u32;
    forSale: bool;

    public static fromPayload(payload: Picture): Picture {
        const picture = new Picture();
        picture.id = payload.id;
        picture.image = payload.image;
        picture.description = payload.description;
        picture.price = payload.price;
        picture.owner = context.sender;
        picture.sold = 0;
        picture.likes = 0;
        picture.forSale = true;
        return picture;
    }


    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }

    public incrementLikes(): void {
        this.likes = this.likes + 1;
    }

    public changePrice(newPrice: u128): void {
        this.price = newPrice;
    }

    public endSale(): void {
        this.forSale = false;
    }
}

export const pictureStorage = new PersistentUnorderedMap<string, Picture>("LISTED_PICTURES");
export const likedStorage = new PersistentUnorderedMap<string, string[]>("LIKED_PICTURES");

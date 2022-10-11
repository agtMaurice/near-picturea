import { Picture, pictureStorage, likedStorage } from './model';
import { context, ContractPromiseBatch, u128 } from "near-sdk-as";


  /**
   * @dev users will be able to like a picture 
   */
  export function likePicture(pictureId: string): void {
    const picture = getPicture(pictureId);
    if (picture == null) {
      throw new Error("picture not found");
    }
    assert(picture.owner.toString() != context.sender.toString(),"You cannot like your picture");
    const liked = likedStorage.get(context.sender);
    if(liked != null){
      assert(liked.indexOf(pictureId) == -1,"You have already liked this picture");
      liked.push(pictureId);
      likedStorage.set(context.sender,liked);
    }else{
      likedStorage.set(context.sender,[pictureId]);
    }
    
    picture.incrementLikes(); 
    pictureStorage.set(picture.id, picture);
  }




/**
 * @dev changing the price of the picture in the marketplace
 * 
 */
  export function changePrice(pictureId: string, price: u128): void {
    const picture = getPicture(pictureId);
    if (picture == null) {
      throw new Error("picture not found");
    }
    assert(picture.owner.toString() == context.sender.toString(),"You are not the owner ");
    assert(price > u128.Min, "price needs to be greater than the minimum value");
    picture.changePrice(price); 
    pictureStorage.set(picture.id, picture); 
  }



   /**
  * @dev buying a book from the marketplace
  *   */ 
export function buyPicture(pictureId: string): void {
  const picture = getPicture(pictureId);
  if (picture == null) {
      throw new Error("picture not found");
  }
  assert(picture.owner.toString() != context.sender.toString(),"You cannot buy your picture");
  assert(picture.forSale == true,"Sale for this picture has been stoped");
  assert(picture.price.toString() == context.attachedDeposit.toString(), "attached deposit should be greater than the price");
  ContractPromiseBatch.create(picture.owner).transfer(context.attachedDeposit);
  picture.incrementSoldAmount();
  pictureStorage.set(picture.id, picture);
}


/**
     * @dev allow picture owner to stop sale of picture
     */
 export function stopSale(id: string): void {
  const picture = getPicture(id);
  if (picture == null) {
    throw new Error("picture not found");
  }
  assert(picture.owner.toString() == context.sender.toString(),"Only the owner can stop sale");
 picture.endSale();
 pictureStorage.set(picture.id, picture);
}



/**
 * 
 * @param Picture - add a picture to the marketplace
 */
export function setPicture(picture: Picture): void {
    let storedPicture = pictureStorage.get(picture.id);
    if (storedPicture !== null) {
        throw new Error(`a picture with id=${picture.id} already exists`);
    }
    pictureStorage.set(picture.id, Picture.fromPayload(picture));
}


 // retrieve picture from storage
export function getPicture(id: string): Picture | null {
    return pictureStorage.get(id);
}

 // getting the liked
 export function getLiked(): string[] | null {
  return likedStorage.get(context.sender);
}

/**
 * 
 * A function that returns an array of pictures for all accounts
 * 
 * @returns an array of objects that represent a picture
 */
export function getPictures(): Array<Picture> {
    return pictureStorage.values();
}

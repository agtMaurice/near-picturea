import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function createPicture(picture) {
  picture.id = uuid4();
  picture.price = parseNearAmount(picture.price + "");
  return window.contract.setPicture({ picture });
}


export function changePrice( Id, _price ) {
  const price = parseNearAmount(_price + "");
  return window.contract.changePrice( { pictureId: Id, price: price }, GAS );
}

export function likePicture( Id ) {
  return window.contract.likePicture( { pictureId: Id }, GAS );
}

export function stopSale( Id ) {
  return window.contract.stopSale( { pictureId: Id }, GAS );
}

export function getPictures() {
  return window.contract.getPictures();
}

export async function buyPicture({ id, price }) {
  await window.contract.buyPicture({ pictureId: id }, GAS, price);
}

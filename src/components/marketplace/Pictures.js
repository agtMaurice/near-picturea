import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddPicture from "./AddPicture";
import Picture from "./Picture";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getPictures as getPictureList,
  buyPicture,
  stopSale,
  likePicture,
  changePrice,
  createPicture,
} from "../../utils/marketplace";


const Pictures = () => {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);

  const account = window.walletConnection.account();

 
  const getPictures = useCallback(async () => {
    try {
      setLoading(true);
      setPictures(await getPictureList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const addPicture = async (data) => {
    setLoading(true);
    try {
      await createPicture(data).then((resp) => {
        toast(<NotificationSuccess text="Picture added successfully." />);
        getPictures();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add a picture." />);
    } finally {
      setLoading(false);
    }
  };

  const stopForsale = async (id) => {
    setLoading(true);

    try {
      await stopSale(id).then((resp) => {
        toast(<NotificationSuccess text="Sale succesfully stoped." />);
        getPictures();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to stop sale." />);
    } finally {
      setLoading(false);
    }
  };

  const LikePicture = async (id) => {
    setLoading(true);

    try {
      await likePicture(id).then((resp) => {
        toast(<NotificationSuccess text="you successfully liked this picture" />);
        getPictures();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to like picture" />);
    } finally {
      setLoading(false);
    }
  };




  const editPrice = async (_Id, _price) => {
    setLoading(true);

    try {
      await changePrice(_Id, _price).then((resp) => {
        toast(<NotificationSuccess text="price changed successfully." />);
        getPictures();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to change the price." />);
    } finally {
      setLoading(false);
    }
  };

  

  //  function to initiate transaction
  const buy = async (id, price) => {
    try {
      await buyPicture({
        id,
        price,
      }).then((resp) =>{
        toast(<NotificationSuccess text="Picture bought successfully" />);
        getPictures()
      });
    } catch (error) {
      toast(<NotificationError text="Failed to purchase picture." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPictures();
  }, []);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Picturea</h1>
            <AddPicture save={addPicture} />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {pictures.map((_picture) => (
              <Picture
                picture={{
                  ..._picture,
                }}
                key={_picture.id}
                buy={buy}
                editPrice={editPrice}
                stopForsale={stopForsale}
                LikePicture={LikePicture}
                isOwner = {account.accountId === _picture.owner}
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Pictures;

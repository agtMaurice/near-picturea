import React from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Card, Button, Col, Badge, Stack, Form } from "react-bootstrap";
import { useState } from "react";

const Picture = ({
	picture,
	buy,
	editPrice,
	LikePicture,
	stopForsale,
	isOwner,
}) => {
	const {
		id,
		image,
		description,
		price,
		owner,
		sold,
		likes,
		forSale

	} = picture;

	const [newprice, setNewPrice] = useState("");

	const triggerBuy = () => {
		buy(id, price);
	};

	
	const triggereditPrice = () => {
		editPrice(id, newprice);
	};
	const triggerLike = () => {
		LikePicture(id);
	};

	const triggereStopforSale = () => {
		stopForsale(id);
	};

	return (
		<Col>
			<Card className=" h-100">
				<Card.Header>
					<Stack direction="horizontal" gap={3}>
						<span className="font-monospace text-secondary">
							{owner}
						</span>
						<Badge bg="secondary" className="ms-auto">
							{sold} Sold
						</Badge>
						<Badge bg="secondary" className="ms-auto">
							{likes} Likes
						</Badge>
					</Stack>
				</Card.Header>
				<div className=" ratio ratio-4x3">
					<img
						src={image}
						alt={description}
						style={{ objectFit: "cover" }}
					/>
				</div>
				<Card.Body className="d-flex  flex-column text-center">
					<Card.Title>Description: {description}</Card.Title>

					{isOwner === true && forSale !== false && (
						<>
							<Form.Control
								className={"pt-2 mb-1"}
								type="number"
								placeholder="Enter new price"
								onChange={(e) => {
									setNewPrice(e.target.value);
								}}
							/>

							<Button
								variant="dark"
								className={"mb-4"}
								onClick={() => triggereditPrice()}
							>
								Change price
							</Button>
						</>
					)}

				
					{isOwner === true && forSale !== false && (
						<>
							

							<Button
								variant="dark"
								className={"mb-4"}
								onClick={() => triggereStopforSale()}
							>
								Stop sale
							</Button>
						</>
					)}

					{isOwner !== true && (
						<>
							<Button
								variant="primary"
								className={"mb-4"}
								onClick={() => triggerLike()}
							>
								Like Picture
							</Button>
						</>
					)}

					{isOwner !== true && forSale === true && (
						<Button
							variant="outline-dark"
							onClick={triggerBuy}
							className="w-100 py-3"
						>
							Buy for {utils.format.formatNearAmount(price)} NEAR
						</Button>
					
					)}
				</Card.Body>
			</Card>
		</Col>
	);
};

Picture.propTypes = {
	picture: PropTypes.instanceOf(Object).isRequired,
	buy: PropTypes.func.isRequired,
};

export default Picture;

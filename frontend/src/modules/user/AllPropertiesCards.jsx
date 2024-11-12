import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Carousel, Col, Form, InputGroup, Row } from 'react-bootstrap';
// import { Col, Form, Input, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import { message } from 'antd';

const AllPropertiesCards = ({ loggedIn }) => {
   const [index, setIndex] = useState(0);
   const [show, setShow] = useState(false);
   const [allProperties, setAllProperties] = useState([]);
   const [filterPropertyType, setPropertyType] = useState('');
   const [filterPropertyAdType, setPropertyAdType] = useState('');
   const [filterPropertyAddress, setPropertyAddress] = useState('');
   const [propertyOpen, setPropertyOpen] = useState(null)
   const [userDetails, setUserDetails] = useState({
      fullName: '',
      phone: 0,
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUserDetails({ ...userDetails, [name]: value });
   };

   const handleClose = () => setShow(false);

   const handleShow = (propertyId) => {
      setPropertyOpen(propertyId)
      setShow(true)
   };

   const getAllProperties = async () => {
      try {
         const res = await axios.get('http://localhost:8000/api/user/getAllProperties');
         setAllProperties(res.data.data);
      } catch (error) {
         console.log(error);
      }
   };

   const handleBooking = async (status, propertyId, ownerId) => {
      try {
         await axios.post(`http://localhost:8000/api/user/bookinghandle/${propertyId}`, { userDetails, status, ownerId }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`
            }
         })
            .then((res) => {
               if (res.data.success) {
                  message.success(res.data.message)
                  handleClose()
               }
               else {
                  message.error(res.data.message)
               }
            })
      } catch (error) {
         console.log(error);
      }
   }


   useEffect(() => {
      getAllProperties();
   }, []);



   const handleSelect = (selectedIndex) => {
      setIndex(selectedIndex);
   };

   const filteredProperties = allProperties
      .filter((property) => filterPropertyAddress === '' || property.propertyAddress.includes(filterPropertyAddress))
      .filter(
         (property) =>
            filterPropertyAdType === '' ||
            property.propertyAdType.toLowerCase().includes(filterPropertyAdType.toLowerCase())
      )
      .filter(
         (property) =>
            filterPropertyType === '' ||
            property.propertyType.toLowerCase().includes(filterPropertyType.toLowerCase())
      );

   return (
      <>
         <div className=" mt-4 filter-container text-center">
            <p className="mt-3">Filter By: </p>
            <input
               type="text"
               placeholder=": Address"
               value={filterPropertyAddress}
               onChange={(e) => setPropertyAddress(e.target.value)}
            />
            <select value={filterPropertyAdType} onChange={(e) => setPropertyAdType(e.target.value)}>
               <option value="">All Ad Types</option>
               <option value="sale">Sale</option>
               <option value="rent">Rent</option>
            </select>
            <select value={filterPropertyType} onChange={(e) => setPropertyType(e.target.value)}>
               <option value="">All Types</option>
               <option value="commercial">Commercial</option>
               <option value="land/plot">land/Plot</option>
               <option value="residential">Residential</option>
            </select>
         </div>
         <div className="d-flex column mt-5">
            {filteredProperties && filteredProperties.length > 0 ? (
               filteredProperties.map((property) => (
                  <Card border="dark" key={property._id} style={{ width: '18rem', marginLeft: 10 }}>
                     <Card.Body>
                        <Card.Title><img src={"data:image/jpeg;base64,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"} alt='photos' /></Card.Title>
                        <Card.Text>
                           <p style={{ fontWeight: 600 }} className='my-1'>Location:</p> {property.propertyAddress} <br />
                           <p style={{ fontWeight: 600 }} className='my-1'>Property Type:</p> {property.propertyType} <br />
                           <p style={{ fontWeight: 600 }} className='my-1'>Ad Type:</p> {property.propertyAdType} <br />
                           {!loggedIn ? (
                              <>
                              </>
                           ) : (
                              <>
                                 <p style={{ fontWeight: 600 }} className='my-1'>Owner Contact:</p> {property.ownerContact} <br />
                                 <p style={{ fontWeight: 600 }} className='my-1'>Availabilty:</p> {property.isAvailable} <br />
                                 <p style={{ fontWeight: 600 }} className='my-1'>Property Amount:</p> Rs.{property.propertyAmt}<br />
                              </>
                           )}
                        </Card.Text>
                        {
                           !loggedIn ? (<>
                              <p style={{ fontSize: 12, color: 'orange', marginTop: 20 }}>For more details, click on get info</p>
                              <Link to={'/login'}>
                                 <Button style={{ float: 'left' }} variant="outline-dark">
                                    Get Info
                                 </Button>
                              </Link></>
                           ) : (
                              <div>
                                 {
                                    property.isAvailable === "Available" ? <><p style={{ float: 'left', fontSize: 12, color: 'orange' }}>Get More Info of the Property</p>
                                       <Button onClick={() => handleShow(property._id)} style={{ float: 'right' }} variant="outline-dark">
                                          Get Info
                                       </Button>
                                       <Modal show={show && propertyOpen === property._id} onHide={handleClose}>
                                          <Modal.Header closeButton>
                                             <Modal.Title>Property Info</Modal.Title>
                                          </Modal.Header>
                                          <Modal.Body>
                                             {property.propertyImage && property.propertyImage.length > 0 && (
                                                <Carousel activeIndex={index} onSelect={handleSelect}>
                                                   {property.propertyImage.map((image, idx) => (
                                                      <Carousel.Item key={idx}>
                                                         <img
                                                            src={`http://localhost:8001${image.path}`}
                                                            alt={`Image ${idx + 1}`}
                                                            className="d-block w-100"
                                                         />
                                                      </Carousel.Item>
                                                   ))}
                                                </Carousel>
                                             )}
                                             <div>
                                                <div className="d-flex my-3">
                                                   <div>
                                                      <p className='my-1'><b>Owner Contact:</b> {property.ownerContact} </p>
                                                      <p className='my-1'><b>Availabilty:</b> {property.isAvailable} </p>
                                                      <p className='my-1'><b>Property Amount: </b>Rs.{property.propertyAmt}</p>
                                                   </div>
                                                   <div className="mx-4">
                                                      <p className='my-1'><b>Location:</b> {property.propertyAddress} </p>
                                                      <p className='my-1'><b>Property Type:</b> {property.propertyType} </p>
                                                      <p className='my-1'><b>Ad Type: </b>{property.propertyAdType}</p>
                                                   </div>
                                                </div>
                                                <p className='my-1'><b>Additional Info: </b>{property.additionalInfo}</p>
                                             </div>
                                             <hr />
                                             <div>
                                                <span className='w-100'><h4><b>Your Details to confirm booking</b></h4></span>
                                                <Form onSubmit={(e) => {
                                                   e.preventDefault();
                                                   handleBooking('pending', property._id, property.ownerId)
                                                }}>
                                                   <Row className="mb-3">
                                                      <Form.Group as={Col} md="6">
                                                         <Form.Label>Full Name</Form.Label>
                                                         <InputGroup hasValidation>
                                                            <Form.Control
                                                               type="text"
                                                               placeholder="Full Name"
                                                               aria-describedby="inputGroupPrepend"
                                                               required
                                                               name='fullName'
                                                               value={userDetails.fullName}
                                                               onChange={handleChange}
                                                            />
                                                         </InputGroup>
                                                      </Form.Group>
                                                      <Form.Group as={Col} md="6">
                                                         <Form.Label>Phone Number</Form.Label>
                                                         <InputGroup hasValidation>
                                                            <Form.Control
                                                               type="number"
                                                               placeholder="Phone Number"
                                                               aria-describedby="inputGroupPrepend"
                                                               required
                                                               name='phone'
                                                               value={userDetails.phone}
                                                               onChange={handleChange}
                                                            />
                                                         </InputGroup>
                                                      </Form.Group>
                                                   </Row>
                                                   <Button type='submit' variant="secondary">
                                                      Book Property
                                                   </Button>
                                                </Form>
                                             </div>


                                          </Modal.Body>
                                       </Modal></> : <p>Not Available</p>
                                 }
                              </div>
                           )
                        }
                     </Card.Body>
                  </Card>
               ))
            ) : (
               <p>No Properties available at the moment.</p>
            )}
         </div>
      </>
   );
};

export default AllPropertiesCards;




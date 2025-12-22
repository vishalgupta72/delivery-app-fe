import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import MainCard from 'ui-component/cards/MainCard';
import { Row, Col, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL, IMAGE_PATH } from 'config/constant';
import { decode as base64_decode } from 'base-64';

const ViewCustomer = () => {
    const { user_id } = useParams();
    const decode_user_id = base64_decode(user_id);
    const [user_data, setUserDetails] = useState({});
    const [show, setShow] = useState(false);
    const [img_arr, setImage] = useState('');
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        axios
            .get(`${API_URL}get_user_data/${decode_user_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                if (response.data.success) {
                    setUserDetails(response.data.res[0]);
                } else {
                    console.error('Error fetching user details:', response.data.msg);
                }
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    }, [user_id]);

    const handleClose = () => {
        setShow(false);
        setImage('');
    };

    const handleShow = (img) => {
        setShow(true);
        setImage(img);
    };

    const renderUserSpecificFields = () => {
        switch(user_data.user_type) {
            case 1: // Player
                return (
                    <>
                        <div className="row">
                            <div className="col-lg-3 cosntomer-name">
                                <p>Team Name:</p>
                            </div>
                            <div className="col-lg-9 cosntomer-name2">
                                <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.team_name || 'NA'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 cosntomer-name">
                                <p>Preferred Foot:</p>
                            </div>
                            <div className="col-lg-9 cosntomer-name2">
                                <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.foot_type_label || 'NA'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 cosntomer-name">
                                <p>Height:</p>
                            </div>
                            <div className="col-lg-9 cosntomer-name2">
                                <p style={{ fontWeight: '500', marginLeft: '0px' }}>
                                    {user_data.height ? `${user_data.height} feet` : 'NA'}
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 cosntomer-name">
                                <p>Weight:</p>
                            </div>
                            <div className="col-lg-9 cosntomer-name2">
                                <p style={{ fontWeight: '500', marginLeft: '0px' }}>
                                    {user_data.weight ? `${user_data.weight} kg` : 'NA'}
                                </p>
                            </div>
                        </div>
                    </>
                );
            case 2: // Coach
                return (
                    <div className="row">
                        <div className="col-lg-3 cosntomer-name">
                            <p>Coaching Name:</p>
                        </div>
                        <div className="col-lg-9 cosntomer-name2">
                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.coaching_name || 'NA'}</p>
                        </div>
                    </div>
                );
            case 3: // Agent
                return (
                    <div className="row">
                        <div className="col-lg-3 cosntomer-name">
                            <p>Organization:</p>
                        </div>
                        <div className="col-lg-9 cosntomer-name2">
                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.organization || 'NA'}</p>
                        </div>
                    </div>
                );
            case 4: // Fan
                return (
                    <>
                        <div className="row">
                            <div className="col-lg-3 cosntomer-name">
                                <p>Favorite Team:</p>
                            </div>
                            <div className="col-lg-9 cosntomer-name2">
                                <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.favorite_team || 'NA'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 cosntomer-name">
                                <p>Favorite Player:</p>
                            </div>
                            <div className="col-lg-9 cosntomer-name2">
                                <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.favorite_player || 'NA'}</p>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p style={{
                    fontSize: '1.25rem',
                    color: '#121926',
                    fontWeight: '600',
                    fontFamily: 'Poppins',
                    lineHeight: '1.167',
                    marginBottom: '5px'
                }}>
                    Deleted User Details
                </p>
            </div>
            
            <Row>
                <Col lg={12}>
                    <MainCard title="User Information">
                        <div className="profile">
                            <div className="user-detail row">
                                <div className="col-lg-3 mr-3">
                                    <div className="col-lg-12">
                                        <div className="row">
                                            <div className="col-lg-6 cosntomer-name2 ml-4">
                                                <img
                                                    src={
                                                        user_data.image
                                                            ? `${IMAGE_PATH}${user_data.image}`
                                                            : `${IMAGE_PATH}placeholder.png`
                                                    }
                                                    alt={user_data.image || 'placeholder'}
                                                    style={{
                                                        width: '17rem',
                                                        height: '17rem',
                                                        borderRadius: '5%',
                                                        cursor: 'pointer',
                                                        marginLeft: '30px'
                                                    }}
                                                    onClick={() => handleShow(user_data.image)}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-9">
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Name:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.name || 'NA'}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Email:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.email || 'NA'}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Country:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.country || 'NA'}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>DOB:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.dob || 'NA'}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>User Type:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>
                                                {user_data.user_type_label || 'NA'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Sport Type:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.sport_type || 'NA'}</p>
                                        </div>
                                    </div>

                                    {renderUserSpecificFields()}

                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Bio:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.bio || 'NA'}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Gender:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>
                                                {user_data.gender_lable || 'NA'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Status:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p
                                                style={{
                                                    borderRadius: '25px',
                                                    background: '#ff1a1a',
                                                    padding: '3px 20px',
                                                    width: '120px',
                                                    color: '#fff',
                                                    fontWeight: '600',
                                                    textAlign: 'center',
                                                    margin: '0'
                                                }}
                                            >
                                                Deleted
                                            </p>
                                        </div>
                                    </div>
                                     <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Deleted Reason:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.delete_reason || 'NA'}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 cosntomer-name">
                                            <p>Create Date:</p>
                                        </div>
                                        <div className="col-lg-9 cosntomer-name2">
                                            <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user_data.createtime || 'NA'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MainCard>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Profile Image</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <img
                        src={img_arr ? `${IMAGE_PATH}${img_arr}` : `${IMAGE_PATH}placeholder.png`}
                        alt="Profile Preview"
                        style={{ maxWidth: '100%', maxHeight: '70vh' }}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ViewCustomer;
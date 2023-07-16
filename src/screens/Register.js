import { useEffect, useRef, useState } from 'react'
import { SHA256 } from 'crypto-js';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'react-bootstrap-icons';
import FormGroup from '../components/common/FormGroup'
import axios from 'axios';
import '../styles/register.css'

const initFormValue = {
    username: '',
    email: '',
    phoneNumber: '',
    password: ''
}
const isEmptyValue = (value) => {
    return value.trim().length === 0
}

const isEmail = (value) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(value)
}
const isPhoneNumber = (value) => {
    const phoneNumberRegex = /^(0|\+84)\d{9}$/;
    return phoneNumberRegex.test(value)
}
const isPassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}/;
    return passwordRegex.test(value)
}
function Register() {
    const navigate = useNavigate();
    const inputUsername = useRef(null)
    const inputEmail = useRef(null)
    const inputPhoneNumber = useRef(null)
    const inputPassword = useRef(null)
    const inputPasswordConfirm = useRef(null)
    const inputCheck = useRef(null)
    const [formValue, setFormValue] = useState(initFormValue)
    const [formError, setFormError] = useState({})
    const [emailExist, setEmailExist] = useState([])
    const [passwordConfirm, setPasswordConfirm] = useState([])
    const [phoneNumberExist, setPhoneNumberExist] = useState([])
    const validateForm = (parentElement, e) => {
        const formErrorMessage = parentElement.querySelector('.form-message')
        const { name } = e
        let formMessage
        const error = {};
        if (isEmptyValue(formValue.username)) {
            error['username'] = 'User name can not is empty'
        }
        if (isEmptyValue(formValue.password)) {
            error['password'] = 'Password can not is empty'
        } else {
            if (!isPassword(formValue.password)) {
                error['password'] = 'Wrong format contain at least uppercase, lowercase, digit and no specical character.'
            }
        }
        if (isEmptyValue(inputPasswordConfirm.current.value)) {
            error['passwordConfirm'] = 'Password comfirm can not is empty'
        } else {
            if (inputPasswordConfirm.current.value !== formValue.password) {
                error['passwordConfirm'] = 'Password confirm is not correct'
            }
        }
        if (isEmptyValue(formValue.email)) {
            error['email'] = 'Email can not is empty'
        } else {
            if (!isEmail(formValue.email)) {
                error['email'] = 'Email format is not correct'
            }
        }
        if (isEmptyValue(formValue.phoneNumber)) {
            error['phoneNumber'] = 'Phonne number can not is empty'
        } else {
            if (!isPhoneNumber(formValue.phoneNumber)) {
                error['phoneNumber'] = 'Phone number format is not correct'
            }
        }
        if (inputCheck.current.checked !== true) {
            error['active'] = 'You need to confirm that you have agreed to our terms'
        }
        Object.keys(error).forEach(e => {
            if (e === name) {
                formMessage = error[e]
            }
        })
        setFormError(error)
        if (formMessage) {
            formErrorMessage.innerText = formMessage
            parentElement.classList.add('invalid')
        } else {
            formErrorMessage.innerText = ''
            parentElement.classList.remove('invalid')
        }
        return Object.keys(error).length === 0
    } 
    const handleOnChange = (e) => {
        const { value, name } = e.target
        if (name !== 'active' && name !== 'passwordConfirm') {
            setFormValue({
                ...formValue,
                [name]: value
            })
        }
    }
    const handleOnChangePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value)
    }
    const getParentElement = (element) => {
        let formGroup = '.form-group_register'
        let parentElement
        while (element.parentElement) {
            if (element.parentElement.matches(formGroup)) {
                parentElement = element.parentElement
                break
            }
            element = element.parentElement
        }
        return parentElement
    }
    const handleOnBlur = (e) => {
        validateForm(getParentElement(e.target), e.target)
    }
    const handleOnFocus = (e) => {
        const formErrorMessage = getParentElement(e.target).querySelector('.form-message')
        formErrorMessage.innerText = ''
        getParentElement(e.target).classList.remove('invalid')
    }
    useEffect(() => {
        fetch('http://localhost:9999/customers')
            .then(res => res.json())
            .then(users => setEmailExist(users.filter((user) => user.email === formValue.email)))
        fetch('http://localhost:9999/customers')
            .then(res => res.json())
            .then(users => setPhoneNumberExist(users.filter((user) => user.phoneNumber === formValue.phoneNumber)))
    }, [formValue.email, formValue.phoneNumber])
    var count = 0
    const handleOnSubmit = (e) => {
        e.preventDefault()
        if (!inputUsername.current.value) {
            validateForm(getParentElement(document.getElementById('username')), document.getElementById('username'))
        }
        if (!inputEmail.current.value) {
            validateForm(getParentElement(document.getElementById('email')), document.getElementById('email'))
        }
        if (!inputPhoneNumber.current.value) {
            validateForm(getParentElement(document.getElementById('phoneNumber')), document.getElementById('phoneNumber'))
        }
        if (!inputPassword.current.value) {
            validateForm(getParentElement(document.getElementById('password')), document.getElementById('password'))
        }
        if (!inputPasswordConfirm.current.value) {
            validateForm(getParentElement(document.getElementById('passwordConfirm')), document.getElementById('passwordConfirm'))
        }
        if (!inputCheck.current.checked) {
            validateForm(getParentElement(document.getElementById('active')), document.getElementById('active'))
        }
        if (Object.keys(formError).length === 0) {
            const addUser = async (Customer) => {
                try {
                    await axios.post('http://localhost:9999/customers', Customer)
                        .then(response => {
                            if (response.status >= 200 && response.status < 300) {
                                localStorage.setItem('register_success', 'register_success')
                                navigate('/login')
                            }
                        })
                } catch (error) {
                    const errorMsg = Object.keys(formValue)
                    errorMsg.map(e => (
                        getParentElement(document.getElementById(e))
                            .querySelector('.form-message')
                            .innerText = 'Error! An error occurred. Please try again later'
                    ))
                    console.error('Lỗi khi thêm người dùng:', error);
                }
            };
            if (emailExist.length !== 0 && typeof formError.email === 'undefined') {
                e.preventDefault()
                if (typeof formError.email === 'string' || typeof formError.email === 'undefined') {
                    const formErrorMessage = getParentElement(document.getElementById('email')).querySelector('.form-message')
                    formErrorMessage.innerText = 'This email is exist'
                }
            }
            if (phoneNumberExist.length !== 0 && typeof formError.phoneNumber === 'undefined') {
                e.preventDefault()
                if (typeof formError.phoneNumber === 'string' || typeof formError.phoneNumber === 'undefined') {
                    const formErrorMessage = getParentElement(document.getElementById('phoneNumber')).querySelector('.form-message')
                    formErrorMessage.innerText = 'This phone number is exist'
                }
            }
            if (phoneNumberExist.length === 0 && emailExist.length === 0) {
                const keys = Object.keys(formValue)
                keys.some(id => {
                    if (id !== 'customerId' && id !== 'role' && document.getElementById(id).value !== '') {
                        count++ 
                        if (count === 4) {
                            addUser({
                                username: formValue.username,
                                email: formValue.email,
                                phoneNumber: formValue.phoneNumber,
                                password: SHA256(formValue.password).toString(),
                                role: 1
                            })
                            return true
                        }
                    } else {
                        e.preventDefault()
                    }
                    return false
                })
            }
        } else {
            e.preventDefault()
        }
    }

    return (
        <Container>
            <Row>
                <Col xs={12} className='mt-2 mb-3' >
                    <h3><Link className='btn-home_link' to={'/'}><ArrowLeft /> Homepage</Link></h3>
                </Col>
            </Row>
            <Row className='border'>
                <Col md={6} className='d-none d-sm-block d-sm-none d-md-block left-part-register'>

                </Col>
                <Col xs={12} md={6} className='right-part'>
                    <Form id='form-1' onSubmit={(e) => handleOnSubmit(e)}>
                        <Card className='border-0'>
                            <Card.Header className='pt-4 pb-4'><h1 style={{ paddingLeft: 25 }}>User Registration</h1></Card.Header>
                            <Card.Body className='pb-0 register_body_card'>
                                <FormGroup className={'form-group_register'} md={12} inputRef={inputUsername} label={'User name'} placeholder={'abcd...'} name={'username'} value={formValue.username} onBlur={handleOnBlur} onFocus={handleOnFocus} onChange={handleOnChange} />
                                <FormGroup className={'form-group_register'} md={12} inputRef={inputEmail} label={'Email'} placeholder={'abc@gmail.com'} name={'email'} value={formValue.email} onBlur={handleOnBlur} onFocus={handleOnFocus} onChange={handleOnChange} />
                                <FormGroup className={'form-group_register'} md={12} inputRef={inputPhoneNumber} label={'Phone number'} placeholder={'0375297280'} name={'phoneNumber'} value={formValue.phoneNumber} onBlur={handleOnBlur} onFocus={handleOnFocus} onChange={handleOnChange} />
                                <FormGroup className={'form-group_register'} md={12} inputRef={inputPassword} type={'password'} label={'Password'} placeholder={'Ab123456'} name={'password'} value={formValue.password} onBlur={handleOnBlur} onFocus={handleOnFocus} onChange={handleOnChange} />
                                <FormGroup className={'form-group_register'} md={12} inputRef={inputPasswordConfirm} type={'password'} label={'Password confirm'} placeholder={'Ab123456'} name={'passwordConfirm'} value={passwordConfirm} onBlur={handleOnBlur} onFocus={handleOnFocus} onChange={handleOnChangePasswordConfirm} />
                                <Row>
                                    <Col md={12} className="pl-4">
                                        <Form.Group className='form-group_register'>
                                            <span className='form-message'></span>
                                            <Form.Check
                                                ref={inputCheck}
                                                onBlur={(e) => handleOnBlur(e)}
                                                onFocus={(e) => handleOnFocus(e)}
                                                onChange={(e) => handleOnChange(e)}
                                                type={'checkbox'}
                                                id={'active'}
                                                name={'active'}
                                                label='By clicking on the confirmation box next to it, it means that you have carefully read and agreed to our terms.' />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className='text-center'>
                                <Row>
                                    <Col xs={12} className='pt-2'>
                                        <Button className='btn_register' type='submit'>Register</Button>
                                    </Col>
                                    <Col className='pb-2'>
                                        <span>Already have an account? <Link to={'/login'} className='text-primary' >login</Link></span>
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Register


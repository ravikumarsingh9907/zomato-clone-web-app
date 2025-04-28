import './form.scss';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useContext, useState } from 'react';
import { formContext } from '../Context/formProvider';
import * as yup from 'yup';
import { postData } from '../Utilities/api';

export default function Forms() {
    const [credentialErrorMessage, setCredentialErrorMessage] = useState('');
    const [isCorrectCredential, setIsCorrectCredential] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { formVisibility, handleFormVisibility, isLogin, handleLoginForm } = useContext(formContext);

    const setFormVisibility = () => {
        handleFormVisibility('form-container hidden');
        document.body.style.overflow = 'auto';
        if (!isLogin) {
            handleLoginForm();
        }
    }

    const handleOtherAuthOptionClick = () => {
        handleLoginForm();
    }

    const handleAlertClick = () => {
        setIsCorrectCredential(!isCorrectCredential)
    }

    let validationSchema;

    let initialValues;

    if (!isLogin) {
        initialValues = {
            email: '',
            password: '',
        }

        validationSchema = yup.object({
            email: yup.string().email().required(`Required`),
            password: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?!.*\s).{7,}$/).required('Required')
        });
    } else if (isLogin) {
        initialValues = {
            fullname: '',
            email: '',
            phone: '',
            password: ''
        }

        validationSchema = yup.object({
            fullname: yup.string().required(`Required`),
            email: yup.string().email().required(`Required`),
            phone: yup.number().positive().required(`Required`),
            password: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?!.*\s).{7,}$/).required('Required')
        });
    }

    const onSubmit = async (values) => {
        setIsLoading(true);
        if (values.fullname) {
            const data = await postData("/users/signup", JSON.stringify(values), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!data.token) {
                setIsCorrectCredential(true);
                setCredentialErrorMessage(data);
                setIsLoading(false);
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('data',  JSON.stringify(data));
                window.location.href = window.location.pathname;
                setIsLoading(false);
            }
        } else {
            const data = await postData("/users/login", JSON.stringify(values), {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!data.token) {
                setIsCorrectCredential(true);
                setCredentialErrorMessage(data);
                setIsLoading(false);
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('data', JSON.stringify(data));
                window.location.href = window.location.pathname;
                setIsLoading(false);
            }
        }
    }

    return (
        <div className={formVisibility}>
            <div className='overlay'></div>
            <div className='form-heading-container'>
                <div className='heading-and-close-btn'>
                    {isLogin ? <h2 className='heading'>Sign up</h2> : <h2 className='heading'>Login</h2>}
                    <p><span className="material-symbols-outlined" onClick={setFormVisibility}>close</span></p>
                </div>
                {isCorrectCredential && <div className='alert-error'>
                    <p className='alert-name'>{credentialErrorMessage}</p>
                    <span className="material-symbols-outlined" onClick={handleAlertClick}>close</span>
                </div>}
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}>
                    <Form method='post' className='form-list'>
                        {isLogin && <div className='form-control'>
                            <Field
                                id='fullname'
                                className='fullname list'
                                name='fullname'
                                placeholder='Full Name'
                                type='text'
                            />
                            <ErrorMessage name='fullname' />
                        </div>}
                        <div className='form-control'>
                            <Field
                                id='email'
                                className='email list'
                                name='email'
                                placeholder='Email'
                                type='email'
                            />
                            <ErrorMessage name='email' />
                        </div>
                        {isLogin && <div className='form-control'>
                            <Field
                                id='phone'
                                className='phone list'
                                name='phone'
                                placeholder='Phone Number'
                                type='number'
                                min='10'
                            />
                            <ErrorMessage name='phone' />
                        </div>}
                        <div className='form-control'>
                            <Field
                                id='password'
                                className='password list'
                                name='password'
                                type='password'
                                placeholder='Password'
                            />
                            <ErrorMessage name='password' />
                        </div>
                        {isLogin ? <button className='submit-btn' type='submit'>{isLoading ? <i className='bx bx-loader-alt loader'></i> : 'Create Account'}</button> : <button className='submit-btn' type='submit'>{isLoading ? <i className='bx bx-loader-alt loader'></i> : 'Login'}</button>}
                    </Form>
                </Formik>
                <div className='sign-in-btn'>
                    {isLogin && <p><span className='description'>Already have an account? </span><span className='name' onClick={handleOtherAuthOptionClick}>Log in</span></p>}
                    {isLogin || <p><span className='description'>Don't have an account? </span><span className='name' onClick={handleOtherAuthOptionClick}>Create account</span></p>}
                </div>
            </div>data
        </div>
    )
}
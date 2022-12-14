import React from 'react';
import { createInstance, getInstancesFromManyRequests, getFilteredInstances, updateInstance } from '../common/api';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { refreshPage } from '../common/window';


export default function SaleForm () {

    const [userInput, setUserInput] = useState(
        {
            price: '',
            automobile: '',
            salesPerson: '',
            customer: '',
        }
    );

    const [loadData, setLoadData] = useState(
        {
            automobiles: [],
            salesPeople: [],
            customers: [],
        }
    );

    const [noData, setNoData] = useState([]);
    const [alert, setAlert] = useState(<></>);

    useEffect(() => {
        const fetchInstances = async () => {

            try {

                const urls = [
                    'http://localhost:8090/api/sales_people',
                    'http://localhost:8090/api/customers',
                ]
                const obj = await getInstancesFromManyRequests(urls);

                const app = 'automobiles'
                const data = await getFilteredInstances(8100, app, 'sold', false)
                obj[app] = data;

                setNoData(Object.keys(obj).filter(i => obj[i].length == 0));
                setLoadData(obj);

            } catch (e) {
                console.error(e);
            }
        }
        fetchInstances();
    }, []);

    const handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        setUserInput({
            ...userInput, [name]:value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {...userInput};
        data.sales_person = data.salesPerson;
        delete data.salesPerson;

        let response = await createInstance(8090, 'sales', data);

        if (response.ok) {

            const vin = data.automobile;
            response = await updateInstance(8100, 'automobiles', vin, {sold: true});

            if (response.ok) {
                const newInstance = await response.json();

                const cleared = {
                    price: '',
                    automobile: '',
                    salesPerson: '',
                    customer: '',
                };
                setUserInput(cleared);
                setNoData(false);
            }
        // refreshPage();  // how to change the timing?
        } else {
            setAlert(<><div className="alert alert-primary mt-3" role="alert"><div>Invalid input!</div></div></>);
        }
    }

    if (noData.length > 0) {
        return (
            <div className="container">
                <div className="row">
                    <div className="offset-3 col-6">
                        <div className="shadow p-4 mt-4">
                            <h1>Uh oh...</h1>
                            <p>You're missing{' '}
                                {noData.map(i => {
                                    return (
                                    <Link key={i} to={`/${i}/new`}>{i}</Link>
                                    )
                                }
                                )}
                            {' '}data!</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container">
                {alert}
                <div className="row">
                    <div className="offset-3 col-6">
                        <div className="shadow p-4 mt-4">
                            <h1>Create a sale record</h1>
                            <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input onChange={handleChange} placeholder="Price" value={userInput.price} required type="number" min="0" id="price" name="price" className="form-control"/>
                                <label htmlFor="price">Price</label>
                            </div>
                            <div className="mb-3">
                                <select onChange={handleChange} value={userInput.automobile} required id="automobile" name="automobile" className="form-select">
                                    <option value="">Choose an automobile</option>
                                    {loadData.automobiles.map(automobile => {
                                        return (
                                            <option key={automobile.vin} value={automobile.vin}>
                                                {automobile.model.manufacturer.name} {automobile.model.name} ({automobile.vin})
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select onChange={handleChange} value={userInput.salesPerson} required id="salesPerson" name="salesPerson" className="form-select">
                                    <option value="">Choose a sales person</option>
                                    {loadData.salesPeople.map(salesPerson => {
                                        return (
                                            <option key={salesPerson.employee_number} value={salesPerson.employee_number}>
                                                {salesPerson.name} ({salesPerson.employee_number})
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="mb-3">
                                <select onChange={handleChange} value={userInput.customer} required id="customer" name="customer" className="form-select">
                                    <option value="">Choose a customer</option>
                                    {loadData.customers.map(customer => {
                                        return (
                                            <option key={customer.phone_number} value={customer.phone_number}>
                                                {customer.name} ({customer.phone_number})
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <button className="btn btn-primary">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/payment.css';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { username, checkinDateTime, checkoutDateTime, slotIndex, clusterId, bookedSlotsCount } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState('');
    const [pin, setPin] = useState('');
    const [amount, setAmount] = useState(0);

    const initialPriceRates = useMemo(() => ({
        weekday: 10,
        weekend: 15,
        holiday: 20
    }), []);

    const [priceRates, setPriceRates] = useState(initialPriceRates);
    const surchargeRate = 1.5;
    const numFireflies = 10;
    const maxIterations = 100;
    const attractionFactor = 0.5;

    // Function to format date to HH:MM
    const formatTime = (date) => {
        const d = new Date(date);
        const hours = String(d.getHours()).padStart(2, '0'); // Ensure two digits
        const minutes = String(d.getMinutes()).padStart(2, '0'); // Ensure two digits
        return `${hours}:${minutes}`;
    };

    const calculateAmount = useCallback((checkin, checkout) => {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const timeDifference = checkoutDate - checkinDate;
        const hours = Math.ceil(timeDifference / (1000 * 60 * 60));

        let totalAmount = 0;
        for (let i = 0; i < hours; i++) {
            const currentHour = new Date(checkinDate);
            currentHour.setHours(checkinDate.getHours() + i);

            let hourlyRate;
            if (isHoliday(currentHour)) {
                hourlyRate = priceRates.holiday;
            } else if (isWeekend(currentHour)) {
                hourlyRate = priceRates.weekend;
            } else {
                hourlyRate = priceRates.weekday;
            }

            if (bookedSlotsCount >= 2) {
                hourlyRate *= surchargeRate;
            }

            totalAmount += hourlyRate;
        }

        return totalAmount;
    }, [priceRates, bookedSlotsCount, surchargeRate]);

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const isHoliday = (date) => {
        const holidays = ['01-01', '01-26', '08-15', '10-02', '10-24', '11-12', '12-25'];
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        return holidays.includes(formattedDate);
    };

    const fireflyOptimization = useCallback(() => {
        let fireflies = Array.from({ length: numFireflies }, () => ({
            price: Math.random() * 20 + 5,
            fitness: 0
        }));

        const historicalData = [
            { price: 10, occupancy: 50 },
            { price: 15, occupancy: 30 },
            { price: 20, occupancy: 20 }
        ];

        const evaluateFitness = (firefly) => {
            let revenue = 0;
            historicalData.forEach(data => {
                let adjustedPrice = firefly.price;
                if (bookedSlotsCount >= 2) {
                    adjustedPrice *= surchargeRate;
                }
                if (data.price <= adjustedPrice) {
                    revenue += adjustedPrice * data.occupancy;
                }
            });
            return revenue;
        };

        for (let iteration = 0; iteration < maxIterations; iteration++) {
            fireflies.forEach(firefly => {
                firefly.fitness = evaluateFitness(firefly);
            });

            for (let i = 0; i < fireflies.length; i++) {
                for (let j = 0; j < fireflies.length; j++) {
                    if (fireflies[j].fitness > fireflies[i].fitness) {
                        fireflies[i].price += (fireflies[j].price - fireflies[i].price) * attractionFactor;
                        fireflies[i].price = Math.max(5, Math.min(25, fireflies[i].price));
                    }
                }
            }
        }

        const bestFirefly = fireflies.reduce((prev, curr) => (prev.fitness > curr.fitness ? prev : curr));
        setPriceRates({
            weekday: bestFirefly.price * 0.5,
            weekend: bestFirefly.price * 0.75,
            holiday: bestFirefly.price
        });
    }, [numFireflies, maxIterations, attractionFactor, bookedSlotsCount, surchargeRate]);

    useEffect(() => {
        if (checkinDateTime && checkoutDateTime) {
            const calculatedAmount = calculateAmount(checkinDateTime, checkoutDateTime);
            setAmount(calculatedAmount);
        }
    }, [checkinDateTime, checkoutDateTime, calculateAmount]);

    useEffect(() => {
        fireflyOptimization();
    }, [fireflyOptimization]);

    const handleConfirmSlot = async () => {
        if (!paymentMethod || !pin || !username || !checkinDateTime || !checkoutDateTime || !slotIndex) {
            alert('Please fill out all required fields.');
            return;
        }

        const formattedCheckinTime = formatTime(checkinDateTime);
        const formattedCheckoutTime = formatTime(checkoutDateTime);

        const bookingData = {
            username,
            slotIndex: slotIndex + 1,
            checkinDate: checkinDateTime,
            checkoutDate: checkoutDateTime,
            checkinTime: formattedCheckinTime,
            checkoutTime: formattedCheckoutTime
        };

        try {
            const response = await fetch('http://localhost:9090/api/v1/parking/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                alert(`Slot ${slotIndex + 1} booked successfully.`);
                handlePaymentSubmit();
            } else {
                const errorResponse = await response.json();
                alert(`Error booking slot: ${errorResponse.message}`);
            }
        } catch (error) {
            console.error('Error booking slot:', error);
        }
    };

    const handlePaymentSubmit = async () => {
        const paymentData = {
            username,
            slotIndex,
            amount,
            paymentMethod,
            pin,
            checkinDateTime,
            checkoutDateTime,
            clusterId
        };

        try {
            const response = await fetch('http://localhost:9090/api/v1/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            if (response.ok) {
                alert('Payment successful!');
                navigate('/');
            } else {
                const errorResponse = await response.json();
                alert(`Payment failed: ${errorResponse.message}`);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment Details</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleConfirmSlot(); }}>
                <label>
                    Payment Method:
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">Select Payment Method</option>
                        <option value="Cash">Tap to Pay</option>
                        <option value="CreditCard">Credit Card</option>
                        <option value="DebitCard">Debit Card</option>
                        <option value="UPI">UPI</option>
                    </select>
                </label>

                <label>
                    Enter PIN:
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="PIN"
                    />
                </label>

                <label>
                    Amount to be Paid:
                    <input
                        type="number"
                        value={amount}
                        readOnly
                    />
                </label>

                <button type="submit">Pay Now</button>
            </form>
        </div>
    );
};

export default Payment;

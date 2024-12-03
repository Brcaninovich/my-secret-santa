import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import santaWalkingAnimation from "../animation.json";
import "../styles/DrawPage.css";
import Lottie from "lottie-react";
import { fetchAvailableNames, markNameAsTaken } from "../services/firestoreService";

function DrawPage() {
    const [userName, setUserName] = useState("");
    const [drawnName, setDrawnName] = useState(localStorage.getItem("drawnName"));
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSanta, setShowSanta] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
        setIsButtonDisabled(e.target.value === "");
    };

    const handleDraw = async () => {
        if (loading) return;
        setLoading(true);
        setShowSanta(true);

        try {
            const names = await fetchAvailableNames();
            if (names.length === 0) {
                alert("Svi su već izvučeni!");
                setShowSanta(false);
                setLoading(false);
                return;
            }

            if (names.length === 1) {
                const randomName = names[0];
                if (randomName.name === formatName(userName)) {
                    alert("Greska pitaj dzenu sta se desava");
                    setLoading(false);
                    setShowSanta(false);
                    return;
                }

                await markNameAsTaken(randomName.id);
                localStorage.setItem("drawnName", randomName.name);
                setDrawnName(randomName.name);
                setShowConfetti(true);
                setLoading(false);
                setShowSanta(false);
                return;
            }
            let randomName;
            do {
                randomName = names[Math.floor(Math.random() * names.length)];
            } while (randomName.name === formatName(userName));

            await markNameAsTaken(randomName.id);

            localStorage.setItem("drawnName", randomName.name);
            setDrawnName(randomName.name);

            setShowConfetti(true);

        } catch (error) {
            console.error("Došlo je do greške pri izvlačenju imena:", error);
        } finally {
            setShowSanta(false);
            setLoading(false);
        }
    };


    const formatName = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    return (
        <div className="draw-page">
            <header className="header">Secret Santa</header>
            <div className="content">
                {!drawnName && (
                    <div className="name-input">
                        <input
                            type="text"
                            value={userName}
                            onChange={handleUserNameChange}
                            placeholder="Unesi svoje ime"
                        />
                    </div>
                )}

                {drawnName ? (
                    <div className="result">
                        <h2>Dosao/la ti je:</h2>
                        <div className="selected-name">{drawnName}</div>
                    </div>
                ) : (
                    <div className="santa-animation">
                        {showSanta && <Lottie animationData={santaWalkingAnimation} loop />}
                    </div>
                )}
                {!drawnName && (
                    <button
                        className="draw-button"
                        onClick={handleDraw}
                        disabled={isButtonDisabled || loading}
                    >
                        {loading ? "Izvlačenje..." : "Izvuci ime"}
                    </button>
                )}
            </div>
            {showConfetti && <Confetti />}
        </div>
    );
}

export default DrawPage;

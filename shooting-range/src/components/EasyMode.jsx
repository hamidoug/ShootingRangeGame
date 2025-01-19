import React from "react";
import ReactDOM from 'react-dom/client';
import { Link, useNavigate, Navigate} from "react-router-dom";
import "../scss/EasyMode.scss"
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { toHaveFormValues } from "@testing-library/jest-dom/matchers";
import CSRFToken from "./CSRFToken";
import Cookies from "js-cookie";

axios.defaults.withCredentials = true;

function EasyMode() {
    //add accuracy of the shot (how close to the center is it)
    //in future levels, dots can be smaller too (maybe only in hard)
    //in medium, dots are just there for a shorter time
    const [levelTimer, setLevelTimer] = useState(60); //level timer
    const [score, setScore] = useState(0);
    const [dotPosition, setDotPosition] = useState({x: 0, y: 0});
    const [gameState, setGameState] = useState('startMenu');
    const [countdown, setCountdown] = useState(3);
    const [totalClicks, setTotalClicks] = useState(0);
    const [totalTargetsHit, setTotalTargetsHit] = useState(0);
    const respawnTimerRef = useRef(null);
    const [sumInDotAccuracy, setSumInDotAccuracy] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');


    //score is gonna be overall hits in the time allotted (dots hit / 60) * 4.2 
    //example is (100 dots hit / 60 seconds) * 4.2 = 7
    //minus accuracy points if (dots hit / total clicks) is less than .83 or 83%, then do score times 1/2(1 - the percent)
    // (logic is that for every 5 dots hit you can do a misclick)
    //continuing example, if only had 40% accuracy, meaning (100 dots hit / 250 total clicks) = .4 or 40% accurate, so score is now
    //7 times (1 - 1/2(1 - 40%))
    //then plus accuracy bonus within dot if special (if accuracy 75% or higher, add .2 of the accuracy to the score)
    
    const navigate = useNavigate();

    const handleGoToUserHomePage = async() => {
        await updateHighScoreAfterGame(score);
        navigate('/userhomepage');
    };

    const updateHighScoreAfterGame = async (finalScore) => {
        try {
            const csrfToken = Cookies.get('csrftoken'); 
            console.log('CSRF Token:', csrfToken); 
    
            await axios.put(
                'http://127.0.0.1:8000/user_auth/update_user_profile',
                {
                    easy_high_score: finalScore, 
                    medium_high_score: 0, 
                    hard_high_score: 0,
                },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
    
            console.log('Successfully updated high score.');
        } catch (e) {
            console.error('Error updating high score:', e.response?.data || e.message);
        }
    };
    
    const respawnDot = () => {
        setDotPosition({
            x: Math.random() * (window.innerWidth - 100),
            y: Math.random() * (window.innerHeight - 100),
        });
        if (respawnTimerRef.current) {
            clearTimeout(respawnTimerRef.current);
        }
        respawnTimerRef.current = setTimeout(respawnDot, 1000);
    };
    const handleDotClick = (event) => {
        event.stopPropagation();
        const clickX = event.clientX;
        const clickY = event.clientY;
        const centerX = dotPosition.x + 50;
        const centerY = dotPosition.y + 50;
        const clickToCenterDistance = Math.sqrt(
            Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
        );
        const circleRadius = 50;
        const halfInnerSquareWidth = 10;
        const radiusOfAccuracy = circleRadius - halfInnerSquareWidth;
        if (clickToCenterDistance <= halfInnerSquareWidth) {
            setSumInDotAccuracy((prev) => prev + 100);
        } else {
            const distanceFromSquareEdge = clickToCenterDistance - halfInnerSquareWidth;
            setSumInDotAccuracy((prev) => prev + (((radiusOfAccuracy - distanceFromSquareEdge) / radiusOfAccuracy) * 100));
        }
        
        //track total clicks
        setTotalClicks((prev) => prev + 1);
        //track total targets hit
        setTotalTargetsHit((prev) => prev + 1);
        //track score based on clicks, accuracy and total targets hit
        //respawn dot
        respawnDot();
    }

    const handleGameAreaClick = () => {
        setTotalClicks((prev) => prev + 1);
    }
    const handleEasyModeStart = () => {
        setGameState("countdown");
        let currentCountdown = 3;
        const countdownInterval = setInterval(() => {
            setCountdown(currentCountdown);
            currentCountdown--;
            
            if (currentCountdown < 0) {
                clearInterval(countdownInterval);
                setGameState("playing");
                respawnDot();
            }
         }, 1000);
        };
    
        useEffect(() => {
            if (gameState === "endOfLevel") {
                let calculatedScore = (totalTargetsHit / 60) * 4.2;
                const overallAccuracy = totalClicks > 0 ? totalTargetsHit / totalClicks : 0;
        if (overallAccuracy < 0.83) {
            calculatedScore *= (1 - (1 / 2) * (1 - overallAccuracy));
        }
                const averageInDotAccuracy = totalTargetsHit > 0
            ? (sumInDotAccuracy / totalTargetsHit) / 100
            : 0;
            if (averageInDotAccuracy >= .75) {
                calculatedScore += (.2 * averageInDotAccuracy);
            }
            const finalScore = calculatedScore || 0;
            setScore(finalScore);
            updateHighScoreAfterGame(finalScore);
            }
        }, [gameState, totalTargetsHit, totalClicks, sumInDotAccuracy]);


    useEffect(() => {
        if (gameState === "playing") {
            const levelTimerInterval = setInterval(() => {
                setLevelTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(levelTimerInterval);
                        if (respawnTimerRef.current) {
                            clearTimeout(respawnTimerRef.current);
                        }
                        setGameState("endOfLevel");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => {clearInterval(levelTimerInterval);
            if (respawnTimerRef.current) {
                clearTimeout(respawnTimerRef.current);
            }
        };
    }
    }, [gameState]);
    
    
    return (
    <div className="easymode">
        {gameState === "startMenu" && (
        <div className="easy-mode-start-menu">
        <h1>Easy Mode</h1>
        <h3>Can you beat your previous high score?</h3>
        <button className="start-button" onClick={handleEasyModeStart}>Start</button>
        </div>
        )}
        {gameState === "countdown" && (
            <div className="countdown-page">
                <div className="countdown-container">
                <h1>{countdown}</h1>
                </div>
            </div>
        )}
        {gameState === "playing" && (
            <div className="easy-mode-gameplay" onClick={handleGameAreaClick}> 
            <div className="easy-mode-target" 
            style={{left: `${dotPosition.x}px`,
            top: `${dotPosition.y}px`
        }} onClick={handleDotClick}> 
        <div className="easy-mode-target-center"> </div>
        </div>
            </div>
        )}
        {gameState === "endOfLevel" && (
            //show targets hit, number of total clicks, total accuracy on target hits (relative to the center), and custom score
            <div> 
                <div className="performance-summary-container">
                <h1>
                    Performance Summary
                </h1>
                <div className="performance-details">
                <h3>Level: Easy</h3>
                <h3>Total Clicks: {totalClicks}</h3>
                <h3>Targets hit: {totalTargetsHit}</h3>
                        <h3>Overall Score: {score}</h3>
                </div>
        <button className="login-button" onClick={ handleGoToUserHomePage}>Go To Home Page</button> 
                </div>
            </div>
        )}
        </div>
    );
}

export default EasyMode;
"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './slot-machine.module.css';

const SlotMachinePage = () => {
    const symbols = ['🍒', '🍋', '🍉', '⭐', '🔔', '💎', 'BAR', '７'];
    const reelCount = 3;
    const baseSymbolHeight = 40; // Dynamicznie aktualizowane
    const visibleSymbols = 3;
    const spinDurationBase = 1800;
    const spinDurationIncrement = 400;

    const slotMachineRef = useRef<HTMLDivElement>(null);
    const reelRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null)
    ];
    const spinButtonRef = useRef<HTMLButtonElement>(null);
    const resultDisplayRef = useRef<HTMLDivElement>(null);
    const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

    const [spinning, setSpinning] = useState(false);
    const [currentSymbolHeight, setCurrentSymbolHeight] = useState(baseSymbolHeight);

    let confettiParticles = useRef<any[]>([]).current;
    let confettiAnimationId = useRef<number | null>(null).current;
    let confettiTimeoutId = useRef<NodeJS.Timeout | null>(null).current;
    let allowParticleReset = useRef(true).current;


    const initializeReels = (isSpinning = false) => {
        let actualSymbolHeight = baseSymbolHeight;
        if (reelRefs[0].current && reelRefs[0].current.children.length > 0) {
            const testSymbol = reelRefs[0].current.children[0] as HTMLElement;
            if (testSymbol) {
                 actualSymbolHeight = testSymbol.offsetHeight || baseSymbolHeight;
            }
        } else if (typeof window !== 'undefined') { // Fallback if no symbols yet
            const tempDiv = document.createElement('div');
            tempDiv.className = styles.symbol;
            tempDiv.style.visibility = 'hidden';
            document.body.appendChild(tempDiv);
            actualSymbolHeight = tempDiv.offsetHeight || baseSymbolHeight;
            document.body.removeChild(tempDiv);
        }
        setCurrentSymbolHeight(actualSymbolHeight);

        reelRefs.forEach(reelRef => {
            const reelStrip = reelRef.current;
            if (!reelStrip) return;

            if (!isSpinning) {
                reelStrip.innerHTML = '';
            }

            const stripSymbols: string[] = [];
            const numRepeats = isSpinning ? 8 : 5;
            for (let i = 0; i < numRepeats; i++) {
                stripSymbols.push(...[...symbols].sort(() => 0.5 - Math.random()));
            }
            for (let i = 0; i < 10; i++) {
                stripSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }

            if (!isSpinning || reelStrip.children.length === 0) {
                reelStrip.innerHTML = ''; // Clear if not spinning or empty
                stripSymbols.forEach(symbolText => {
                    const div = document.createElement('div');
                    div.classList.add(styles.symbol);
                    if (symbolText === '７') {
                        div.classList.add(styles.symbolSeven);
                    }
                    div.textContent = symbolText;
                    div.style.height = `${actualSymbolHeight}px`;
                    reelStrip.appendChild(div);
                });
            } else { // If spinning and strip exists, ensure it's long enough
                // This part might need more robust handling if symbols change dynamically during spin
                // For now, we assume initializeReels(true) rebuilds it if necessary
                 reelStrip.innerHTML = '';
                 stripSymbols.forEach(symbolText => {
                    const div = document.createElement('div');
                    div.classList.add(styles.symbol);
                    if (symbolText === '７') {
                        div.classList.add(styles.symbolSeven);
                    }
                    div.textContent = symbolText;
                    div.style.height = `${actualSymbolHeight}px`;
                    reelStrip.appendChild(div);
                });
            }

            const initialOffset = Math.floor(Math.random() * (reelStrip.children.length - visibleSymbols + 1));
            reelStrip.style.transition = 'none';
            reelStrip.style.transform = `translateY(-${initialOffset * actualSymbolHeight}px)`;
        });
    };

    const spin = async () => {
        if (spinning) return;
        setSpinning(true);
        if (spinButtonRef.current) spinButtonRef.current.disabled = true;
        if (resultDisplayRef.current) {
            resultDisplayRef.current.textContent = 'KRĘCĘ...';
            resultDisplayRef.current.className = styles.resultDisplay; // Reset classes
        }
        if (slotMachineRef.current) slotMachineRef.current.className = styles.slotMachine; // Reset classes

        document.querySelectorAll(`.${styles.symbol}.${styles.winningSymbolHighlight}`).forEach(el => {
            el.classList.remove(styles.winningSymbolHighlight);
        });

        initializeReels(true);

        const forceThreeSeven = Math.random() < 0.9; // 90% szansy na próbę uzyskania trzech siódemek

        const spinPromises = reelRefs.map(async (reelRef, i) => {
            const reelStrip = reelRef.current;
            if (!reelStrip) return;

            const totalSymbolsInStrip = reelStrip.children.length;
            let targetSymbolIndexOnStrip: number; // Indeks na pasku symbolu, który znajdzie się na środku widoku

            if (forceThreeSeven) {
                let sevenIndex = -1;
                const possibleSevenIndices: number[] = [];
                for (let k = 0; k < totalSymbolsInStrip; k++) {
                    if (reelStrip.children[k].textContent === '７') {
                        // Sprawdź, czy ta '７' (na indeksie k) może być środkowym symbolem
                        const topIndexOfVisibleSetIfKIsMiddle = k - Math.floor(visibleSymbols / 2);
                        const bottomIndexOfVisibleSetIfKIsMiddle = k + Math.floor(visibleSymbols / 2);

                        if (topIndexOfVisibleSetIfKIsMiddle >= 0 && bottomIndexOfVisibleSetIfKIsMiddle < totalSymbolsInStrip) {
                            possibleSevenIndices.push(k); // k jest prawidłowym indeksem dla środkowego symbolu
                        }
                    }
                }

                if (possibleSevenIndices.length > 0) {
                    // Wybierz losową '７' z możliwych, aby wyglądało to mniej deterministycznie
                    sevenIndex = possibleSevenIndices[Math.floor(Math.random() * possibleSevenIndices.length)];
                    targetSymbolIndexOnStrip = sevenIndex;
                } else {
                    // Fallback: '７' nie znaleziono w odpowiedniej pozycji. Niech ten bęben kręci się losowo.
                    // Oznacza to, że próba 90% na 777 może się nie powieść, jeśli '7' nie jest dostępne.
                    const randomTopIndex = Math.floor(Math.random() * (totalSymbolsInStrip - visibleSymbols + 1));
                    targetSymbolIndexOnStrip = randomTopIndex + Math.floor(visibleSymbols / 2);
                }
            } else {
                // Oryginalna logika losowa
                const randomTopIndex = Math.floor(Math.random() * (totalSymbolsInStrip - visibleSymbols + 1));
                targetSymbolIndexOnStrip = randomTopIndex + Math.floor(visibleSymbols / 2);
            }

            // Upewnij się, że targetSymbolIndexOnStrip jest prawidłowym indeksem środkowego symbolu
            // Minimalny indeks środkowy: Math.floor(visibleSymbols / 2)
            // Maksymalny indeks środkowy: (totalSymbolsInStrip - 1) - Math.floor(visibleSymbols / 2)
            targetSymbolIndexOnStrip = Math.max(Math.floor(visibleSymbols / 2), targetSymbolIndexOnStrip);
            targetSymbolIndexOnStrip = Math.min(targetSymbolIndexOnStrip, (totalSymbolsInStrip - 1) - Math.floor(visibleSymbols / 2));

            // Symbol na targetSymbolIndexOnStrip powinien znaleźć się na środku.
            // Indeks GÓRNEGO widocznego symbolu to targetSymbolIndexOnStrip - Math.floor(visibleSymbols / 2)
            const targetTopSymbolIndex = targetSymbolIndexOnStrip - Math.floor(visibleSymbols / 2);
            const targetTranslateY = -targetTopSymbolIndex * currentSymbolHeight;

            const initialSpinCycles = 3 + i;
            const veryLowPosition = targetTranslateY - (totalSymbolsInStrip * currentSymbolHeight * initialSpinCycles);

            reelStrip.style.transition = 'none';
            reelStrip.style.transform = `translateY(${veryLowPosition}px)`;
            reelStrip.offsetHeight; // Wymuś reflow

            const currentSpinDuration = spinDurationBase + i * spinDurationIncrement;
            reelStrip.style.transition = `transform ${currentSpinDuration / 1000}s cubic-bezier(0.25, 0.1, 0.2, 1)`;
            reelStrip.style.transform = `translateY(${targetTranslateY}px)`;

            return new Promise(resolve => setTimeout(resolve, currentSpinDuration));
        });

        await Promise.all(spinPromises);
        checkWin();
        setSpinning(false);
        if (spinButtonRef.current) spinButtonRef.current.disabled = false;
    };

    const checkWin = () => {
        if (!resultDisplayRef.current || !slotMachineRef.current) return;

        const winningSymbolsElements: HTMLElement[] = [];
        const results = reelRefs.map(reelRef => {
            const reelStrip = reelRef.current;
            if (!reelStrip) return '';

            const transformValue = getComputedStyle(reelStrip).transform;
            const matrix = new DOMMatrixReadOnly(transformValue);
            const translateY = matrix.m42;
            const topSymbolIndex = Math.abs(Math.round(translateY / currentSymbolHeight));
            const middleSymbolIndexInView = Math.floor(visibleSymbols / 2);

            const winningSymbolElement = reelStrip.children[topSymbolIndex + middleSymbolIndexInView] as HTMLElement;
            if (winningSymbolElement) {
                winningSymbolsElements.push(winningSymbolElement);
                return winningSymbolElement.textContent || '';
            }
            return '';
        });

        resultDisplayRef.current.textContent = `WYNIK: ${results.join(' | ')}`;
        resultDisplayRef.current.className = styles.resultDisplay; // Reset classes

        const isThreeSeven = results.every(s => s === '７');
        const isJackpot = results.every(s => s === results[0] && s !== '');
        const isSmallWin = (results[0] === results[1] && results[0] !== '') || (results[1] === results[2] && results[1] !== '');

        if (isThreeSeven) {
            resultDisplayRef.current.textContent = `🔥 ７７７ SUPER JACKPOT! 🔥`;
            resultDisplayRef.current.classList.add(styles.winSuperJackpot);
            triggerConfetti('sevenSevenSeven');
            slotMachineRef.current.classList.add(styles.shake, styles.jackpotGlow);
            winningSymbolsElements.forEach(el => el?.classList.add(styles.winningSymbolHighlight));
            setTimeout(() => slotMachineRef.current?.classList.remove(styles.shake, styles.jackpotGlow), 1000);
        } else if (isJackpot) {
            resultDisplayRef.current.textContent = `🎉 JACKPOT! ${results[0]} 🎉`;
            resultDisplayRef.current.classList.add(styles.winJackpot);
            triggerConfetti('jackpot');
            winningSymbolsElements.forEach(el => el?.classList.add(styles.winningSymbolHighlight));
        } else if (isSmallWin) {
            resultDisplayRef.current.textContent = `💰 MAŁA WYGRANA! ${results.join(' | ')} 💰`;
            if(resultDisplayRef.current) resultDisplayRef.current.style.color = '#90ee90';
            triggerConfetti('smallWin');
            if (results[0] === results[1]) {
                winningSymbolsElements[0]?.classList.add(styles.winningSymbolHighlight);
                winningSymbolsElements[1]?.classList.add(styles.winningSymbolHighlight);
            }
            if (results[1] === results[2]) {
                winningSymbolsElements[1]?.classList.add(styles.winningSymbolHighlight);
                winningSymbolsElements[2]?.classList.add(styles.winningSymbolHighlight);
            }
        } else {
            if(resultDisplayRef.current) resultDisplayRef.current.style.color = '#ff6b6b';
        }
    };

    // --- Confetti ---
    const baseConfettiColors = ["#fca311", "#e85d04", "#ffd60a", "#00b4d8", "#48cae4", "#f8f9fa"];
    const sevenSevenSevenColors = ["#ffd700", "#ffc300", "#ff0000", "#dc2f02", "#fff1e6"];

    function ConfettiParticle(this: any, type = 'smallWin', canvasWidth: number, canvasHeight: number) {
        this.type = type; // Store type for reset
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * -canvasHeight * 0.5;
        this.size = (type === 'sevenSevenSeven' ? Math.random() * 12 + 6 : type === 'jackpot' ? Math.random() * 10 + 5 : Math.random() * 8 + 4);
        this.color = type === 'sevenSevenSeven' ? sevenSevenSevenColors[Math.floor(Math.random() * sevenSevenSevenColors.length)] : baseConfettiColors[Math.floor(Math.random() * baseConfettiColors.length)];
        this.speedX = Math.random() * (type === 'sevenSevenSeven' ? 8 : 6) - (type === 'sevenSevenSeven' ? 4 : 3);
        this.speedY = Math.random() * (type === 'sevenSevenSeven' ? 5 : 3) + (type === 'sevenSevenSeven' ? 3 : 2);
        this.opacity = 1;
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * (type === 'sevenSevenSeven' ? 0.3 : 0.2);
        this.gravity = 0.05;
        this.drag = 0.98;
        this.shape = Math.random() > 0.7 ? 'circle' : 'rect';
        this.initialLife = type === 'sevenSevenSeven' ? 250 : type === 'jackpot' ? 200 : 150;
        this.life = this.initialLife;
    }

    ConfettiParticle.prototype.update = function(canvasWidth: number, canvasHeight: number) {
        this.speedY += this.gravity;
        this.speedX *= this.drag;
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin * 10;
        this.life--;
        this.opacity = Math.max(0, this.life / this.initialLife);

        if (this.y > canvasHeight + this.size * 2 || this.life <=0) {
            if (confettiAnimationId && allowParticleReset) {
                this.y = Math.random() * -canvasHeight * 0.1 - this.size;
                this.x = Math.random() * canvasWidth;
                this.opacity = 1;
                this.life = this.initialLife;
                this.speedY = Math.random() * (this.type === 'sevenSevenSeven' ? 5 : 3) + (this.type === 'sevenSevenSeven' ? 3 : 2);
                this.speedX = Math.random() * (this.type === 'sevenSevenSeven' ? 8 : 6) - (this.type === 'sevenSevenSeven' ? 4 : 3);
            } else {
                this.opacity = 0;
            }
        }
    };

    ConfettiParticle.prototype.draw = function(ctx: CanvasRenderingContext2D) {
        if (this.opacity <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.fillStyle = this.color;
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillRect(-this.size / 2, -this.size / (Math.random() > 0.5 ? 2 : 3), this.size, this.size / (Math.random() > 0.5 ? 2 : 1.5));
        }
        ctx.restore();
    };

    const animateConfetti = () => {
        const canvas = confettiCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeParticles = false;
        confettiParticles.forEach(particle => {
            particle.update(canvas.width, canvas.height);
            particle.draw(ctx);
            if (particle.opacity > 0) activeParticles = true;
        });

        if (activeParticles) {
            confettiAnimationId = requestAnimationFrame(animateConfetti);
        } else {
            confettiAnimationId = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear when done
        }
    };

    const triggerConfetti = (type = 'smallWin') => {
        const canvas = confettiCanvasRef.current;
        if (!canvas) return;

        let numConfetti;
        let duration;
        switch(type) {
            case 'sevenSevenSeven': numConfetti = 350; duration = 5000; break;
            case 'jackpot': numConfetti = 200; duration = 3500; break;
            default: numConfetti = 80; duration = 2000; break;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const newParticles = [];
        for (let i = 0; i < numConfetti; i++) {
            // @ts-ignore
            newParticles.push(new ConfettiParticle(type, canvas.width, canvas.height));
        }
        confettiParticles = newParticles;


        if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
        if (confettiTimeoutId) clearTimeout(confettiTimeoutId);

        allowParticleReset = true;
        animateConfetti();

        confettiTimeoutId = setTimeout(() => {
            allowParticleReset = false;
        }, duration - 1000);
    };

    useEffect(() => {
        initializeReels(false); // Initial setup

        const handleResize = () => {
            if (confettiCanvasRef.current) {
                confettiCanvasRef.current.width = window.innerWidth;
                confettiCanvasRef.current.height = window.innerHeight;
            }
            // Re-initialize reels to adjust symbol heights if necessary
            // Pass false to prevent clearing if not desired, or true if full rebuild is needed
            initializeReels(false);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to set initial canvas size

        return () => {
            window.removeEventListener('resize', handleResize);
            if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
            if (confettiTimeoutId) clearTimeout(confettiTimeoutId);
        };
    }, []);


    return (
        <div className={styles.slotMachineContainer}>
            <div className={styles.slotMachine} id="slotMachine" ref={slotMachineRef}>
                <div className={styles.reelsContainer}>
                    <div className={styles.reel} id="reel1"><div className={styles.reelStrip} ref={reelRefs[0]}></div></div>
                    <div className={styles.reel} id="reel2"><div className={styles.reelStrip} ref={reelRefs[1]}></div></div>
                    <div className={styles.reel} id="reel3"><div className={styles.reelStrip} ref={reelRefs[2]}></div></div>
                </div>
                <div className={styles.controls}>
                    <button id="spinButton" ref={spinButtonRef} onClick={spin} className={styles.spinButton}>ZAKRĘĆ!</button>
                    <div id="resultDisplay" ref={resultDisplayRef} className={styles.resultDisplay}>POWODZENIA!</div>
                </div>
            </div>
            <canvas id="confettiCanvas" ref={confettiCanvasRef} className={styles.confettiCanvas}></canvas>
        </div>
    );
};

export default SlotMachinePage;


import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [sideHearts, setSideHearts] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [targetDate, setTargetDate] = useState(null);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let targetDate;
      
      // Verificar si ya tenemos una fecha objetivo guardada
      const savedTargetDate = localStorage.getItem('anniversaryTargetDate');
      
      if (savedTargetDate) {
        targetDate = new Date(savedTargetDate);
        
        // Si la fecha guardada ya pasó, crear una nueva para el próximo 25
        if (now > targetDate) {
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth();
          targetDate = new Date(currentYear, currentMonth, 25);
          
          // Si ya pasó el 25 de este mes, usar el 25 del próximo mes
          if (now > targetDate) {
            targetDate.setMonth(currentMonth + 1);
          }
          
          // Guardar la nueva fecha objetivo
          localStorage.setItem('anniversaryTargetDate', targetDate.toISOString());
        }
        
        // Guardar la fecha objetivo en el estado
        setTargetDate(targetDate);
      } else {
        // Primera vez: crear la fecha objetivo para el 25 de este mes
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        targetDate = new Date(currentYear, currentMonth, 25);
        
        // Si ya pasó el 25 de este mes, usar el 25 del próximo mes
        if (now > targetDate) {
          targetDate.setMonth(currentMonth + 1);
        }
        
        // Guardar la fecha objetivo
        localStorage.setItem('anniversaryTargetDate', targetDate.toISOString());
      }
      
      // Guardar la fecha objetivo en el estado para mostrarla
      setTargetDate(targetDate);
      
      const difference = targetDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Efecto para pantalla de carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnterButton(true);
    }, 7000); // Mostrar botón después de 7 segundos

    return () => clearTimeout(timer);
  }, []);

  const handleEnterApp = () => {
    // Crear confeti de corazones
    createConfetti();
    setShowLoading(false);
  };

  const createConfetti = () => {
    const confettiPieces = [];
    const heartTypes = ['💕', '💖', '💗', '💝', '💘', '💞', '💓', '💟'];
    
    for (let i = 0; i < 50; i++) {
      confettiPieces.push({
        id: i,
        emoji: heartTypes[Math.floor(Math.random() * heartTypes.length)],
        x: Math.random() * window.innerWidth,
        y: -50,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.8 + 0.5,
        speed: Math.random() * 3 + 2,
        rotationSpeed: Math.random() * 10 - 5,
        delay: Math.random() * 1000
      });
    }
    
    setConfetti(confettiPieces);
    
    // Limpiar confeti después de 5 segundos
    setTimeout(() => {
      setConfetti([]);
    }, 5000);
  };


  // Efecto para corazones laterales
  useEffect(() => {
    const createSideHeart = () => {
      const heartTypes = ['💕', '💖', '💗', '💝', '💘'];
      const side = Math.random() > 0.5 ? 'left' : 'right';
      const size = Math.random() * 1.2 + 2.5; // Entre 2.5 y 3.7
      const speed = Math.random() * 2 + 3; // Entre 3 y 5 segundos
    
    const newHeart = {
        id: Date.now() + Math.random(),
        side: side,
        type: heartTypes[Math.floor(Math.random() * heartTypes.length)],
        size: size,
        speed: speed,
        x: side === 'left' ? 20 : window.innerWidth - 20,
        y: window.innerHeight + 50
      };
      
      setSideHearts(prev => [...prev, newHeart]);
      console.log('Corazón creado:', newHeart);
      
      // Remover el corazón después de la animación
      setTimeout(() => {
        setSideHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
      }, speed * 1000);
    };

    // Crear el primer corazón inmediatamente
    createSideHeart();
    
    // Crear corazones cada 2-4 segundos
    const heartInterval = setInterval(createSideHeart, Math.random() * 2000 + 2000);
    
    return () => clearInterval(heartInterval);
  }, []);

  // Pantalla de carga
  if (showLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-hearts">
            <span className="loading-heart">💕</span>
            <span className="loading-heart">💖</span>
            <span className="loading-heart">💗</span>
            <span className="loading-heart">💝</span>
            <span className="loading-heart">💘</span>
          </div>
          <h1 className="loading-title">Preparando algo especial</h1>
          <p className="loading-subtitle">porque para mí eres especial (en todos los sentidos)</p>
          <p className="loading-message">y sabes que me gusta escribirte cartas siempre</p>
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          
          {showEnterButton && (
            <div className="enter-button-container">
              <button className="enter-button" onClick={handleEnterApp}>
                <span className="button-heart">💕</span>
                <span className="button-text">Entrar a mi carta de amor</span>
                <span className="button-heart">💕</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Confeti de corazones */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: piece.x,
            top: piece.y,
            fontSize: `${piece.scale}rem`,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confettiFall ${piece.speed}s ease-in forwards`,
            animationDelay: `${piece.delay}ms`
          }}
        >
          {piece.emoji}
        </div>
      ))}

      {/* Corazón de prueba estático */}
      <div 
        className="side-heart left" 
        style={{
          left: 50,
          top: window.innerHeight - 100,
          fontSize: '3.5rem',
          animation: 'heartFloatUpLeft 4s ease-out infinite'
        }}
      >
        💕
      </div>
      
      {/* Corazones laterales */}
      {sideHearts.map(heart => (
        <div
          key={heart.id}
          className={`side-heart ${heart.side}`}
          style={{
            left: heart.x,
            top: heart.y,
            fontSize: `${heart.size}rem`,
            animation: `heartFloatUp${heart.side === 'left' ? 'Left' : 'Right'} ${heart.speed}s ease-out forwards`
          }}
        >
          {heart.type}
        </div>
      ))}

      <div className="love-letter-container">
        
        <div className="letter-header">
          <div className="title-container">
            <h1 className="letter-title">
              <span className="title-word">Mi</span>
              <span className="title-word special">Amorcheto</span>
          </h1>
          </div>
          <div className="decorative-line"></div>
          <div className="magical-border"></div>
        </div>


        <div className="letter-content">
          <div className="letter-text">
            <div className="letter-paragraph-container">
              <p className="letter-paragraph">
                Qué increíble es el darme cuenta de que al fin tengo las palabras correctas para decirte todo lo que siento, que mi mente y mi corazón están en sintonía y solo quieren gritarle al mundo la suerte que tengo de tenerte a mi lado.
              </p>
              <div className="paragraph-emoji-circle">
                <span className="paragraph-emoji">💕</span>
              </div>
            </div>

            <div className="letter-paragraph-container">
              <p className="letter-paragraph">
                Eres, sin duda, la mejor cosa que me ha pasado en la vida, y no me refiero solo a tu belleza, sino a la plenitud que me regalas. Tienes una fortaleza que inspira, una dulzura que sana. Estar contigo es como encontrar ese lugar en el mundo donde todo es fácil, donde simplemente puedo ser.
              </p>
              <div className="paragraph-emoji-circle">
                <span className="paragraph-emoji">💖</span>
              </div>
            </div>

            <div className="letter-paragraph-container">
              <p className="letter-paragraph">
                De una forma maravillosa, complementas lo que por tanto tiempo creí que me sobraba: la ansiedad, el exceso de pensamiento, la incertidumbre. Siempre fui de más dudas que certezas, más tierra que aire. Cuando estamos juntos, todo eso se disuelve, se convierte en una calma que jamás imaginé, como si mi yo más genuino pudiera florecer, simplemente por tu presencia.
              </p>
              <div className="paragraph-emoji-circle">
                <span className="paragraph-emoji">💗</span>
              </div>
            </div>

            <div className="letter-paragraph-container">
              <p className="letter-paragraph">
                Cielo, sabes bien que tuvimos nuestros desafíos, y no hace falta revivir el pasado, pero por un tiempo sentí que cargar con mi historia me hacía indigno de la felicidad. Pero gracias a ti, ahora sé que nunca fue así. Hoy, por fin, estamos bien. Jamás creí encontrar a alguien que, a pesar de los altibajos, me ofrezca tanta seguridad. No soy de grandes creencias, pero el universo conspiró para que nuestros caminos se cruzaran, estoy seguro.
              </p>
              <div className="paragraph-emoji-circle">
                <span className="paragraph-emoji">💝</span>
              </div>
            </div>

            <div className="letter-paragraph-container">
              <p className="letter-paragraph">
                Desde que llegaste, llenaste cada rincón de mi ser. Te pienso en la mañana, en las tardes, en la noche, y es una sensación de absoluta dicha, y todo es por ti. A veces me detengo solo para admirar la realidad de que existes. No sé si fue el momento perfecto para encontrarnos, o si tuvimos que esperar por esto, pero hoy estás aquí, y tú eres lo mejor de mi presente.
              </p>
              <div className="paragraph-emoji-circle">
                <span className="paragraph-emoji">💘</span>
              </div>
            </div>

            <div className="letter-paragraph-container">
              <p className="letter-paragraph">
                Te amo, no porque nuestra vida sea una fantasía, sino porque contigo cada obstáculo es una oportunidad para crecer juntos, y eso lo hemos demostrado. Gracias por ser la melodía más hermosa y el color más brillante en lo que solía ser un mundo un tanto oscuro y complicado.
              </p>
              <div className="paragraph-emoji-circle">
                <span className="paragraph-emoji">💕</span>
              </div>
            </div>

            <div className="letter-signature">
              <p>Con todo mi amor,</p>
              <p className="signature-name">Tu Gordito</p>
            </div>
          </div>
        </div>

        <div className="letter-footer">
          <div className="hearts-decoration">
            <span className="heart">💕</span>
            <span className="heart">💖</span>
            <span className="heart">💕</span>
            <span className="heart">💖</span>
            <span className="heart">💕</span>
            <span className="heart">💖</span>
            <span className="heart">💕</span>
          </div>
          <p className="footer-message">Hecho con amor infinito</p>
          <div className="footer-sparkles">
            <span>✨</span>
            <span>⭐</span>
            <span>✨</span>
          </div>
        </div>
      </div>

      {/* Contador de Aniversario abajo de la carta */}
      <div className="anniversary-counter-bottom">
        <div className="counter-container-bottom">
          <h3 className="counter-title-bottom">Ya falta poco para nuestro aniversario</h3>
          <p className="counter-subtitle-bottom">y ya tengo ganas que sea ese día, no puedo esperar</p>
          <p className="counter-app-message">y esta aplicación tampoco (esta app si sabe contar)</p>
          <div className="counter-grid-bottom">
            <div className="counter-item-bottom">
              <div className="counter-number-bottom">{timeLeft.days}</div>
              <div className="counter-label-bottom">Días</div>
            </div>
            <div className="counter-item-bottom">
              <div className="counter-number-bottom">{timeLeft.hours}</div>
              <div className="counter-label-bottom">Horas</div>
            </div>
            <div className="counter-item-bottom">
              <div className="counter-number-bottom">{timeLeft.minutes}</div>
              <div className="counter-label-bottom">Minutos</div>
            </div>
          </div>
          <div className="counter-seconds-mobile">
            <div className="counter-item-bottom seconds-item">
              <div className="counter-number-bottom">{timeLeft.seconds}</div>
              <div className="counter-label-bottom">Segundos</div>
            </div>
          </div>
               <div className="counter-message-bottom">
                 <span className="heart">💕</span>
                 <span>
                   {targetDate ? 
                     `Hasta el ${targetDate.getDate()} de ${targetDate.toLocaleDateString('es-ES', { month: 'long' })}` : 
                     'Hasta el 25 de este mes'
                   }
                 </span>
                 <span className="heart">💕</span>
               </div>
        </div>
      </div>
    </div>
  );
}

export default App;

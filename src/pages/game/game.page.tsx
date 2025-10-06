import React, { useState, useEffect, useRef } from 'react';
import hugoImage from '../../images/Screenshot from 2025-10-05 20-38-08.png'
import larissaImage from '../../images/Screenshot from 2025-10-05 20-39-05.png'
import larissaFinishImage from '../../images/thumbnail.jpeg'
import hugoFinishImage from '../../images/Screenshot from 2025-10-05 23-15-56.png'

export const GamePage = () => {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameFinish, setGameFinish] = useState(false);
  const [passedPipes, setPassedPipes] = useState(new Set());
  const [selectedCharacter, setSelectedCharacter] = useState('larissa');
  
  const gameLoopRef = useRef(null);
  const pipeIntervalRef = useRef(null);
  
  const GRAVITY = 0.5;
  const JUMP_STRENGTH = -8;
  const BIRD_SIZE = 50;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 250;
  const PIPE_SPEED = 3;
  const GAME_HEIGHT = 700;
  const GAME_WIDTH = 500;

  const characters = {
    larissa: {
      name: 'Larissa LidiAzia',
      color: 'bg-neutral-400',
      emoji: '👩',
      crown: '🪄',
      finishText: `Ei Lari, muito obrigado por jogar o jogo até aqui, ocê foi longe ein! 
                Gostaria que voce soubesse que te admiro muito, com você aprendi muito por isso digo que é tão importante para mim... 
                Obrigado por me ouvir nos momentos que precisei, por sempre fazer meu dia mais leve sempre com um bom humor, obrigado pela cumplicidade/carinho que você tem comigo, tenho orgulho em dizer que criamos isso juntos... Cada dia um segurando a mão do outro, lhe adimiro demais por ser essa mulher forte, batalhadora, não para nunca, mãe incrível, amiga fiel, uma amiga que sempre posso contar
                e também não pode faltar com seu jeito brava de falar comigo (eu gosto, mas é segredo) Kk
                Saiba que você me inspira a ser uma pessoa melhor, me faz querer crescer e evoluir!!! Muito obrigado gata  :] (ta linda na foto viu)
                Então decidi fazer essa brincadeira para demonstrar um pouco do meu carinho que tenho por ti e sua cria.
                Espero que tenham gostado! Beijão do seu futuro... (toma cuidado) ❤️
                (tem mais uma coisa por aqui, recomendo clicar nas coisas)`,
      faceImage: larissaImage,
      pipeImage: 'https://cdn.record.com.br/wp-content/uploads/2019/07/25225747/6123.jpeg',
      pipeColor: 'from-neutral-600 to-neutral-500',
      pipeBorder: 'border-neutral-700',
      bgGradient: 'from-black via-gray-800 to-pink-500',
      catchphrase: 'Aqui, to só tomando filho!',
      maxPoint: 40,
      finishImage: larissaFinishImage,
      footerImages: [
        'https://m.media-amazon.com/images/I/81-jvnt+hgL.jpg',
        'https://cdn.record.com.br/wp-content/uploads/2019/07/25225747/6123.jpeg',
        'https://s2-casaejardim.glbimg.com/hfIdQNH7Q7Js2pFQNUDidNuGBsE=/0x0:900x540/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/g/n/S1kmRzQMadumN4DhOIdA/flor-de-lotus-negra.jpg',
        'https://m.media-amazon.com/images/I/81t9+4cKFtL.jpg',
        'https://cdn.shopify.com/s/files/1/0646/4035/files/pedras-e-cristais-usados-na-meditacao-e-no-equilibrio-espiritual.jpg?v=1596149664'
      ]
    },
    hugo: {
      name: 'Hugo LidiAzia',
      color: 'bg-blue-400',
      emoji: '👦',
      cap: '⚽',
      faceImage: hugoImage,
      maxPoint: 20,
      pipeImage: 'https://mundodosprodutos.com.br/wp-content/uploads/2024/07/curiosidades-sobre-o-flamengo.png',
      pipeColor: 'from-blue-600 to-blue-500',
      catchphrase: 'Aiii papaii, não deu!',
      pipeBorder: 'border-blue-700',
      bgGradient: 'from-blue-600 via-purple-500 to-red-500',
      finishText: `Oi Hugoo, muito obrigado por jogar até aquiiii! 
      Fiz esse joguinho com muito carinho para oceis dois LidiAziaas, se gostou fala pra mim eiiin!
      E como recompensa por chegar aqui vou te dar um presente, fala com sua mãe algo que você queira muito que eu vou comprar para você, pode ser um brinquedo, um jogo, o que você quiser!
      Abração Huguinhooo! :D `,
      finishImage: hugoFinishImage,
      footerImages: [
        'https://tm.ibxk.com.br//2024/10/24/24100744427058.jpg?ims=1200x1200',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyL2QZzo2H9Eibw5v_5pjERwCrHFafpEicig&s',
        'https://cdn1.epicgames.com/offer/fn/FNBR_37-00_C6S4_EGS_Launcher_KeyArt_FNLogo_Carousel_PDP_2560x1440_logo_2560x1440-04348f5d3d52391f572e8c1050ddc737',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAqtUkO9B9m0T0R9jrCcJWISlR1fakx34ePg&s'
      ]
    }
  };
  const currentChar = characters[selectedCharacter];

  const jump = () => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }
    if (gameOver) return;
    setBirdVelocity(JUMP_STRENGTH);
  };

  const resetGame = () => {
    setBirdY(250);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
    setGameFinish(false);
    setPassedPipes(new Set());
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver || gameFinish) return;

    gameLoopRef.current = setInterval(() => {
      setBirdVelocity(v => v + GRAVITY);
      setBirdY(y => {
        const newY = y + birdVelocity;
        
        if (newY > GAME_HEIGHT - BIRD_SIZE - 16 || newY < 0) {
          setGameOver(true);
          return y;
        }
        
        return newY;
      });

      setPipes(currentPipes => {
        const newPipes = currentPipes
          .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        newPipes.forEach(pipe => {
          const birdX = 50;
          const birdRight = birdX + BIRD_SIZE;
          const birdBottom = birdY + BIRD_SIZE;
          const pipeRight = pipe.x + PIPE_WIDTH;

          if (
            birdRight > pipe.x &&
            birdX < pipeRight &&
            (birdY < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP)
          ) {
            setGameOver(true);
          }

          if (score >= currentChar.maxPoint) {
            setGameFinish(true);
          }

          if (birdRight > pipe.x && birdX < pipe.x && !passedPipes.has(pipe.id)) {
            setScore(s => s + 1);
            setPassedPipes(prev => new Set(Array.from(prev).concat(pipe.id)));
          }
        });

        return newPipes;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoopRef.current);
  }, [gameStarted, gameOver, birdY, birdVelocity, passedPipes, gameFinish]);

  useEffect(() => {
    if (!gameStarted || gameOver || gameFinish) return;

    pipeIntervalRef.current = setInterval(() => {
      const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
      setPipes(currentPipes => [
        ...currentPipes,
        {
          id: Date.now(),
          x: GAME_WIDTH,
          topHeight: topHeight
        }
      ]);
    }, 2000);

    return () => clearInterval(pipeIntervalRef.current);
  }, [gameStarted, gameOver, gameFinish]);


  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-b ${currentChar.bgGradient} p-4 transition-all duration-700`}>
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          ❤️ Flappy Família LidiAzia ❤️
        </h1>
        <p className="text-white text-2xl font-bold drop-shadow">Pontuação: {score}</p>
        <p className="text-white text-lg mt-1">Jogando com: {currentChar.name}</p>
      </div>
      
      <div 
        className="relative bg-gradient-to-b from-sky-300 to-sky-200 overflow-hidden cursor-pointer border-4 border-purple-600 rounded-lg shadow-2xl"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
      >
        {/* Nuvens decorativas */}
        <div className="absolute top-10 left-10 text-4xl opacity-70">☁️</div>
        <div className="absolute top-20 right-20 text-3xl opacity-60">☁️</div>
        <div className="absolute top-40 left-32 text-3xl opacity-50">☁️</div>

        {/* Personagem voador */}
        <div
          className={`absolute ${currentChar.color} rounded-full border-4 border-white shadow-lg transition-transform flex items-center justify-center`}
          style={{
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            left: 50,
            top: birdY,
            transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 90)}deg)`
          }}
        >
          {/* Imagem do rosto */}
          <img
            src={currentChar.faceImage}
            alt={currentChar.name}
            className="w-full h-full object-$cover rounded-full"
          />
          {/* Acessório (coroa ou boné) */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-2xl">
            {selectedCharacter === 'larissa' ? currentChar.crown : currentChar.cap}
          </div>
        </div>

        {/* Canos com tema de família */}
        {pipes.map(pipe => (
          <React.Fragment key={pipe.id}>
            {/* Cano superior */}
            <div
              className={`absolute bg-gradient-to-b ${currentChar.pipeColor} border-4 ${currentChar.pipeBorder} rounded-b-lg overflow-hidden`}
              style={{
                width: PIPE_WIDTH,
                height: pipe.topHeight,
                left: pipe.x,
                top: 0
              }}
            >
              {/* Padrão de imagens replicadas */}
              <div className="w-full h-full flex flex-wrap content-start">
                {Array.from({ length: Math.ceil(pipe.topHeight / 30) * 2 }).map((_, i) => (
                  <img
                    key={i}
                    src={currentChar.pipeImage}
                    alt=""
                    className="w-max h-max"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ))}
              </div>
              <div className={`absolute bottom-0 w-full h-8 bg-gradient-to-b ${currentChar.pipeColor} -mb-2 flex items-center justify-center text-white font-bold border-t-2 ${currentChar.pipeBorder}`}>
                ♥
              </div>
            </div>
            
            {/* Cano inferior */}
            <div
              className={`absolute bg-gradient-to-t ${currentChar.pipeColor} border-4 ${currentChar.pipeBorder} rounded-t-lg overflow-hidden`}
              style={{
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP - 16,
                left: pipe.x,
                bottom: 16
              }}
            >
              {/* Padrão de imagens replicadas */}
              <div className="w-full h-full flex flex-wrap content-start">
                {Array.from({ length: Math.ceil((GAME_HEIGHT - pipe.topHeight - PIPE_GAP - 16) / 30) * 2 }).map((_, i) => (
                  <img
                    key={i}
                    src={currentChar.pipeImage}
                    alt=""
                    className="w-max h-max"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ))}
              </div>
              <div className={`absolute top-0 w-full h-8 bg-gradient-to-t ${currentChar.pipeColor} -mt-2 flex items-center justify-center text-white font-bold border-b-2 ${currentChar.pipeBorder}`}>
                ♥
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Chão decorado */}
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-green-700 to-green-600 border-t-4 border-green-800">
          <div className="flex justify-normal items-center h-full w-full text-2xl">
            {currentChar.footerImages.map((imgSrc, index) => {
              return (
              <img
              key={`ground-${index}`}
              src={imgSrc}
              alt=""
              className="w-full h-full"
              style={{ imageRendering: 'pixelated' }}
            />
            )
            })}
          </div>
        </div>

        {/* Tela inicial - Seleção de personagem */}
        {!gameStarted && !gameOver && !gameFinish && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-sm">
              <h2 className="text-3xl font-bold mb-4 text-purple-800">Flappy família LidiAzia!</h2>
              <p className="text-gray-600 mb-6">Escolha quem vai voar:</p>
              
              <div className="flex gap-4 justify-center mb-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCharacter('larissa');
                  }}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    selectedCharacter === 'larissa' 
                      ? 'bg-pink-400 scale-110 shadow-lg' 
                      : 'bg-pink-200 hover:bg-pink-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white mb-2">
                    <img src={characters.larissa.faceImage} alt="Larissa" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xl mb-1">{characters.larissa.crown}</div>
                  <span className="font-bold text-white">Larissa LidiAzia</span>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCharacter('hugo');
                  }}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    selectedCharacter === 'hugo' 
                      ? 'bg-blue-400 scale-110 shadow-lg' 
                      : 'bg-blue-200 hover:bg-blue-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white mb-2">
                    <img src={characters.hugo.faceImage} alt="Hugo" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xl mb-1">{characters.hugo.cap}</div>
                  <span className="font-bold text-white">Hugo LidiAzia</span>
                </button>
              </div>
              
              <p className="text-gray-500 text-sm mb-2">Clique ou pressione ESPAÇO para começar</p>
              <p className="text-gray-400 text-xs">Clique para voar e evite os obstáculos! ❤️</p>
            </div>
          </div>
        )}

        {/* Game Finish */}
        {gameFinish && (
          <div className="overflow-auto absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center justify-center items-center bg-white p-8 rounded-2xl shadow-2xl">
              <h2 className="text-4xl font-bold mb-4 text-green-600">🎉 Parabéns! 🎉</h2>
              <img
                key={`finish-image`}
                src={currentChar.finishImage}
                alt=""
                className="w-[200px] h-[300px] items-center justify-center mx-auto mb-4 border-purple-600"
              />
              {currentChar.finishText.split('\n').map((line, index) => (
                  <p className="text-sm mb-2 text-gray-700">
                    {line}
                  </p>
                ))}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg text-lg"
              >
                🔄 Jogar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center bg-white p-8 rounded-2xl shadow-2xl">
              <h2 className="text-4xl font-bold mb-4 text-red-600">😢 Game Over! 😢</h2>
              <h2 className="text-xl mb-2 text-pink-700">"{currentChar.catchphrase}"</h2>
              <p className="text-xl mb-2 text-gray-700">{currentChar.name} fez:</p>
              <p className="text-3xl font-bold mb-6 text-purple-600">{score} pontos! 🎉</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetGame();
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg text-lg"
              >
                🔄 Jogar Novamente
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-white text-center max-w-md">
        <p className="text-sm drop-shadow">🎮 Clique na tela ou pressione ESPAÇO para voar</p>
        <p className="text-sm mt-1 drop-shadow">❤️ Feito para os dois lidiAziaaas :p </p>
      </div>
    </div>
  );
};

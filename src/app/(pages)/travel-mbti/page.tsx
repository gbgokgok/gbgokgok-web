"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const questions = [
  // E/I
  {
    text: "여행은 누구와 함께할 때 가장 즐거운가요?",
    answers: [
      { text: "친구들이나 가족 등 여럿이 함께일 때", type: "E" },
      { text: "혼자 또는 소수의 사람들과 조용히", type: "I" },
    ],
  },
  {
    text: "낯선 도시를 여행할 때, 당신은?",
    answers: [
      { text: "현지인, 여행자들과 대화를 나누며 어울린다", type: "E" },
      { text: "혼자 조용히 거리를 걷고 분위기를 즐긴다", type: "I" },
    ],
  },
  {
    text: "여행 중 가장 기억에 남는 순간은?",
    answers: [
      { text: "사람들과 함께 웃고 떠든 순간", type: "E" },
      { text: "조용한 장소에서 나만의 시간을 보낸 기억", type: "I" },
    ],
  },
  // N/U
  {
    text: "자유시간이 주어진다면 어디로 가고 싶나요?",
    answers: [
      { text: "산 속이나 해안가 등 자연 속 공간에서 힐링", type: "N" },
      { text: "쇼핑센터, 갤러리, 카페, 젊음의 거리 등 도시 명소", type: "U" },
    ],
  },
  {
    text: "여행 사진 중 가장 자주 올리는 사진은?",
    answers: [
      { text: "자연 풍경이나 노을, 산책길 등 감성 사진", type: "N" },
      { text: "감각적인 건물, 음식, 전시공간 등 도시 풍경", type: "U" },
    ],
  },
  {
    text: "여행지를 고를 때 더 중요하게 생각하는 요소는?",
    answers: [
      { text: "자연 속 힐링, 풍경, 생태", type: "N" },
      { text: "문화 체험, 편의시설, 교통, 도시 분위기", type: "U" },
    ],
  },
  // R/P
  {
    text: "여행 일정은 어떤 게 더 마음에 드시나요?",
    answers: [
      { text: "하루에 1~2곳 정도, 느긋한 여행", type: "R" },
      { text: "계획표에 따라 여러 곳을 효율적으로 돌기", type: "P" },
    ],
  },
  {
    text: "여행지에서 우연히 끌리는 장소를 발견했을 때?",
    answers: [
      { text: "일정과 상관없이 들어가 둘러본다", type: "R" },
      { text: "계획에 없으면 스킵하고 다음 장소로 이동", type: "P" },
    ],
  },
  {
    text: "여행 가방을 쌀 때 당신은?",
    answers: [
      { text: "기본만 챙기고 나머지는 현지에서 결정", type: "R" },
      { text: "일정과 루트에 맞춰 꼼꼼히 준비", type: "P" },
    ],
  },
];

const results = {
    ENR: { 
      name: "함께하는 자연 힐러", 
      description: "사람들과 함께 캠핑, 계곡, 바다 등에서 여유로운 시간을 보내고 싶어함",
      emoji: "🏕️"
    },
    ENP: { 
      name: "활력 있는 자연 액티비티", 
      description: "여럿이서 자연을 빠르게 관광하며 활동적임",
      emoji: "🏄‍♂️"
    },
    EUR: { 
      name: "도시 감성 나들이", 
      description: "친구들과 도심에서 여유로운 카페에서 시간을 보내거나 산책을 즐김",
      emoji: "☕"
    },
    EUP: { 
      name: "도심 투어 리더", 
      description: "친구들과 함께 도심을 빽빽하게 도심을 도는 유형",
      emoji: "🏙️"
    },
    INR: { 
      name: "조용한 자연 스테이", 
      description: "혼자 자연을 느끼며 머무름 위주의 힐링",
      emoji: "🌲"
    },
    INP: { 
      name: "몰입형 자연 트래커", 
      description: "혼자 자연을 깊이 체험하는 유형",
      emoji: "🥾"
    },
    IUR: { 
      name: "조용한 도심의 감성러", 
      description: "도심 속 감성 공간을 조용히 즐기는 유형",
      emoji: "📚"
    },
    IUP: { 
      name: "도심 속 솔로 탐험가", 
      description: "혼자 도심 핫플을 빠르게 탐색하고 즐기는 유형",
      emoji: "🗺️"
    },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function TravelMbtiPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ E: 0, I: 0, N: 0, U: 0, R: 0, P: 0 });
  const [result, setResult] = useState<keyof typeof results | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (type: string) => {
    setIsAnimating(true);
    
    // 점수 업데이트 및 애니메이션 후 다음 질문으로 이동
    setTimeout(() => {
      setScores((prev) => ({ ...prev, [type]: prev[type as keyof typeof scores] + 1 }));
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateResult();
      }
      
      setIsAnimating(false);
    }, 300);
  };
  
  const calculateResult = () => {
    const finalScores = { ...scores };
    // 마지막 답변이 반영되도록 scores를 한번 더 업데이트
    const lastAnswerType = questions[currentQuestionIndex].answers.find(a => a.type)?.type;
    if(lastAnswerType) {
        finalScores[lastAnswerType as keyof typeof scores]++;
    }

    const ei = finalScores.E > finalScores.I ? "E" : "I";
    const nu = finalScores.N > finalScores.U ? "N" : "U";
    const rp = finalScores.R > finalScores.P ? "R" : "P";
    setResult((`${ei}${nu}${rp}`) as keyof typeof results);
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setScores({ E: 0, I: 0, N: 0, U: 0, R: 0, P: 0 });
    setResult(null);
  };
  
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col items-center justify-center p-4 pt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mt-[-40px]"
        >
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-green-500" />
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-gray-800">당신의 여행 MBTI는?</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold text-4xl rounded-full w-40 h-40 flex flex-col items-center justify-center mx-auto mb-6"
              >
                <span className="text-5xl mb-1">{results[result].emoji}</span>
                <span>{result}</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">{results[result].name}</h3>
                <p className="text-gray-600 mb-8 text-center">{results[result].description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">외향/내향</p>
                    <p className="font-bold text-lg text-blue-700">{result.charAt(0) === 'E' ? '외향적' : '내향적'}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-500">자연/도시</p>
                    <p className="font-bold text-lg text-green-700">{result.charAt(1) === 'N' ? '자연 선호' : '도시 선호'}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center col-span-2">
                    <p className="text-sm text-gray-500">여행 스타일</p>
                    <p className="font-bold text-lg text-purple-700">{result.charAt(2) === 'R' ? '여유롭게' : '계획적으로'}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={restartTest} 
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white border-0"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  다시 테스트하기
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 flex flex-col">
      <header className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="hover:bg-white/20">
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800">여행 MBTI 테스트</h1>
        <div className="w-10"></div> {/* 균형을 위한 빈 공간 */}
      </header>

      <div className="flex-1 flex items-center justify-center mt-[-50px]">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="relative">
              <Progress 
                value={progress} 
                className="h-2 bg-gray-200 rounded-none" 
                indicatorClassName="bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300" 
              />
              <div className="absolute top-3 right-3 text-xs font-medium text-gray-500">
                {currentQuestionIndex + 1} / {questions.length}
              </div>
            </div>
            <CardContent className="p-6">
              <motion.h2 
                key={`question-${currentQuestionIndex}`}
                className="text-2xl font-semibold text-center mb-6 flex items-center justify-center text-gray-800 min-h-[3rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion.text}
              </motion.h2>
              
              <div className="space-y-3">
                {currentQuestion.answers.map((answer, index) => (
                  <motion.div 
                    key={`answer-${currentQuestionIndex}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    <Button
                      onClick={() => !isAnimating && handleAnswer(answer.type)}
                      className="w-full min-h-[4rem] text-lg justify-start p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-md overflow-hidden whitespace-normal"
                      variant="outline"
                      disabled={isAnimating}
                    >
                      <span className="font-bold mr-4 text-blue-600">{index === 0 ? 'A.' : 'B.'}</span>
                      <span className="text-left">{answer.text}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


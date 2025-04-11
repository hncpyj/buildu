// // src/types/speech.d.ts
// export {}; // 글로벌 선언 시 필요
// declare global {
//     interface Window {
//       SpeechRecognition: typeof SpeechRecognition;
//       webkitSpeechRecognition: typeof SpeechRecognition;
//     }
//   }
  
  
//   type SpeechRecognitionResultList = {
//     length: number;
//     [index: number]: SpeechRecognitionResult;
//   };
  
//   type SpeechRecognitionResult = {
//     isFinal: boolean;
//     length: number;
//     [index: number]: SpeechRecognitionAlternative[];
//   };
  
//   type SpeechRecognitionAlternative = {
//     transcript: string;
//     confidence: number;
//   };
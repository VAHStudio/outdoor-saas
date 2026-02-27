import React, { useState, useRef, useEffect } from 'react';
import { Mic, X } from 'lucide-react';
import { speechService, useWebSpeechRecognition } from '../services/speechService';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (text: string) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({ isOpen, onClose, onResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  const animationRef = useRef<number>();
  
  const webSpeech = useWebSpeechRecognition();

  useEffect(() => {
    if (isOpen && !isRecording) {
      startRecording();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isRecording) {
      animateWave();
    }
  }, [isRecording]);

  const animateWave = () => {
    // 模拟音量动画
    setVolume(Math.random() * 0.5 + 0.3);
    animationRef.current = requestAnimationFrame(() => {
      setTimeout(animateWave, 100);
    });
  };

  const startRecording = async () => {
    setIsRecording(true);
    setError(null);
    setTranscript('');

    try {
      // 优先使用阿里云语音识别
      await speechService.startRecognition(
        (result) => {
          setTranscript(result.text);
          if (result.isFinal) {
            onResult(result.text);
            handleClose();
          }
        },
        (err) => {
          console.log('阿里云识别失败，尝试Web Speech API:', err);
          // 阿里云失败时，尝试使用Web Speech API
          if (webSpeech.isSupported) {
            webSpeech.start(
              (result) => {
                setTranscript(result.text);
                if (result.isFinal) {
                  onResult(result.text);
                  handleClose();
                }
              },
              (webErr) => {
                setError('语音识别失败，请检查麦克风权限');
                setIsRecording(false);
              }
            );
          } else {
            setError('您的浏览器不支持语音识别功能');
            setIsRecording(false);
          }
        }
      );
    } catch (err) {
      setError('启动语音识别失败');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    speechService.stopRecognition();
    webSpeech.stop();
    setIsRecording(false);
    
    if (transcript) {
      onResult(transcript);
    }
    handleClose();
  };

  const handleClose = () => {
    speechService.stopRecognition();
    webSpeech.stop();
    setIsRecording(false);
    setTranscript('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 mx-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-primary/20">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700 transition-colors"
        >
          <X size={20} className="text-slate-400" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-white mb-2">
            {isRecording ? '正在聆听...' : '语音输入'}
          </h3>
          <p className="text-sm text-slate-400">
            {isRecording ? '请说出您的需求' : '点击下方按钮开始'}
          </p>
        </div>

        {/* 波形动画 */}
        {isRecording && (
          <div className="flex justify-center items-center gap-1 h-24 mb-8">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-primary rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(20, Math.random() * 80 * volume)}px`,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
              />
            ))}
          </div>
        )}

        {/* 识别文本显示 */}
        <div className="min-h-[80px] max-h-[120px] overflow-y-auto mb-8 p-4 bg-slate-950/50 rounded-xl border border-white/5">
          {transcript ? (
            <p className="text-white text-center leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-slate-500 text-center italic">
              {isRecording ? '正在识别...' : '等待输入'}
            </p>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex justify-center">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-colors"
            >
              <div className="w-3 h-3 bg-white rounded-sm" />
              结束录音
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="flex items-center justify-center w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg shadow-primary/30 transition-all hover:scale-105"
            >
              <Mic size={28} />
            </button>
          )}
        </div>

        {/* 提示文字 */}
        <p className="text-center text-xs text-slate-500 mt-6">
          支持中文语音识别 •  Powered by 阿里云智能语音交互
        </p>
      </div>
    </div>
  );
};

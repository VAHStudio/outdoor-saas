/**
 * 阿里云语音交互服务
 * 使用阿里云智能语音交互功能实现语音转文字
 */

// 阿里云语音交互配置
const ALIYUN_CONFIG = {
  accessKeyId: 'LTAI5tBYbMxERSZifUwns3Bo',
  accessKeySecret: 'Dkoab98rtJN3vwT3BdwnFaHHoo0Zl2',
  appKey: 'juFwlOCB6kSZxcLT',
  // 使用阿里云NLS(智能语音交互)服务
  nlsEndpoint: 'wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1',
  // 语音参数
  sampleRate: 16000,
  format: 'pcm',
};

export interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
  confidence?: number;
}

export type SpeechRecognitionCallback = (result: SpeechRecognitionResult) => void;
export type SpeechErrorCallback = (error: Error) => void;

class AliyunSpeechService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private onResultCallback: SpeechRecognitionCallback | null = null;
  private onErrorCallback: SpeechErrorCallback | null = null;
  private ws: WebSocket | null = null;
  private taskId: string = '';

  // 生成唯一任务ID
  private generateTaskId(): string {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 生成UUID
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // URL安全的Base64编码
  private urlSafeBase64(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // 生成RFC2104-HMAC-SHA1签名
  private async hmacSha1(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  // 生成阿里云令牌
  private async generateToken(): Promise<string> {
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000);
    const dateStr = date.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    
    const policyText = JSON.stringify({
      expiration: new Date((timestamp + 3600) * 1000).toISOString(),
      conditions: [
        ['acs:access_key_id', ALIYUN_CONFIG.accessKeyId],
        ['date', dateStr]
      ]
    });
    
    const policy = this.urlSafeBase64(policyText);
    const signature = await this.hmacSha1(ALIYUN_CONFIG.accessKeySecret, policy);
    
    return `${ALIYUN_CONFIG.accessKeyId}:${policy}:${signature}`;
  }

  // 开始语音识别
  async startRecognition(
    onResult: SpeechRecognitionCallback,
    onError: SpeechErrorCallback
  ): Promise<void> {
    try {
      this.onResultCallback = onResult;
      this.onErrorCallback = onError;
      this.audioChunks = [];
      this.isRecording = true;
      this.taskId = this.generateTaskId();

      // 获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: ALIYUN_CONFIG.sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      // 设置MediaRecorder
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        await this.processAudio();
      };

      // 连接阿里云NLS服务
      await this.connectToNLS();

      // 开始录音
      this.mediaRecorder.start(100); // 每100ms收集一次数据

    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 连接到阿里云NLS服务
  private async connectToNLS(): Promise<void> {
    try {
      const token = await this.generateToken();
      const url = `${ALIYUN_CONFIG.nlsEndpoint}?token=${encodeURIComponent(token)}`;
      
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        // 发送开始指令
        const startCmd = {
          header: {
            message_id: this.generateUUID(),
            task_id: this.taskId,
            namespace: 'SpeechRecognizer',
            name: 'StartRecognition',
            appkey: ALIYUN_CONFIG.appKey,
          },
          payload: {
            format: ALIYUN_CONFIG.format,
            sample_rate: ALIYUN_CONFIG.sampleRate,
            enable_intermediate_result: true,
            enable_punctuation_prediction: true,
            enable_inverse_text_normalization: true,
          }
        };
        this.ws?.send(JSON.stringify(startCmd));
      };

      this.ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        this.handleNLSResponse(response);
      };

      this.ws.onerror = (error) => {
        this.handleError(new Error('WebSocket连接错误'));
      };

      this.ws.onclose = () => {
        if (this.isRecording) {
          this.handleError(new Error('WebSocket连接已关闭'));
        }
      };

    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 处理NLS响应
  private handleNLSResponse(response: any): void {
    const { header, payload } = response;
    
    if (header.name === 'RecognitionResultChanged') {
      // 中间结果
      if (this.onResultCallback) {
        this.onResultCallback({
          text: payload.result,
          isFinal: false,
          confidence: payload.confidence,
        });
      }
    } else if (header.name === 'RecognitionCompleted') {
      // 最终结果
      if (this.onResultCallback) {
        this.onResultCallback({
          text: payload.result,
          isFinal: true,
          confidence: payload.confidence,
        });
      }
      this.stopRecognition();
    } else if (header.name === 'RecognitionFailed') {
      this.handleError(new Error(payload.message || '识别失败'));
    }
  }

  // 处理音频数据
  private async processAudio(): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    
    // 将音频数据发送到NLS服务
    // 实际使用时需要将音频转换为PCM格式并分段发送
    // 这里简化处理，实际项目中需要更复杂的音频处理
    
    // 发送停止指令
    const stopCmd = {
      header: {
        message_id: this.generateUUID(),
        task_id: this.taskId,
        namespace: 'SpeechRecognizer',
        name: 'StopRecognition',
        appkey: ALIYUN_CONFIG.appKey,
      }
    };
    this.ws.send(JSON.stringify(stopCmd));
  }

  // 停止语音识别
  stopRecognition(): void {
    this.isRecording = false;
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  // 处理错误
  private handleError(error: Error): void {
    this.stopRecognition();
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  // 检查是否正在录音
  isRecognizing(): boolean {
    return this.isRecording;
  }
}

// 导出单例实例
export const speechService = new AliyunSpeechService();

// 导出简化版语音识别（使用Web Speech API作为备选）
export function useWebSpeechRecognition(): {
  start: (onResult: SpeechRecognitionCallback, onError: SpeechErrorCallback) => void;
  stop: () => void;
  isSupported: boolean;
} {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    return {
      start: () => {},
      stop: () => {},
      isSupported: false,
    };
  }

  let recognition: any = null;

  return {
    start: (onResult, onError) => {
      try {
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          onResult({
            text: finalTranscript || interimTranscript,
            isFinal: !!finalTranscript,
          });
        };

        recognition.onerror = (event: any) => {
          onError(new Error(event.error));
        };

        recognition.start();
      } catch (error) {
        onError(error as Error);
      }
    },
    stop: () => {
      if (recognition) {
        recognition.stop();
      }
    },
    isSupported: true,
  };
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ViewType = 'workbench' | 'chat' | 'campaign-list' | 'campaign-detail' | 'tasks' | 'task-detail' | 'insights' | 'agents';

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  type?: 'text' | 'card';
  cardData?: any;
}

export interface Task {
  id: string;
  title: string;
  location: string;
  status: 'executed' | 'pending' | 'failed' | 'uploaded';
  type: string;
  deadline: string;
}

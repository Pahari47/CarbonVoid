import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import localLLM from '../llm/localLLM.js';

const memory = new BufferMemory();

const greenBotChain = new ConversationChain({
  llm: localLLM,
  memory,
});

export default greenBotChain;
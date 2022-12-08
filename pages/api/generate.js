import { Configuration, OpenAIApi } from 'openai';


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix = "A person who likes ";
const basePromptSuffix=" will also like these 5 "

const generateAction = async (req, res) => {
  // Run first prompts
  console.log(`API: ${basePromptPrefix}${req.body.userInput}${basePromptSuffix}${req.body.choice}: `)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}${basePromptSuffix}${req.body.choice}: `,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
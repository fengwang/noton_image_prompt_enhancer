import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import time
from openai import OpenAI
from noton.Module import Module

class LLM(Module):
    def __init__(self) -> None:
        super().__init__()

class Ollama(LLM):
    def __init__(self, base_url=None, api_key = None, model=None, image_url=None, user_prompt=None, system_prompt=None, retry_attempts=10, retry_interval=15, enable_history=True,
                 frequency_penalty=None, temperature=None, top_p=None
                 ) -> None:
        super().__init__()
        self.base_url_ = base_url
        self.api_key_ = api_key
        self.model_ = model
        self.image_url_ = image_url
        self.user_prompt_ = user_prompt
        self.system_prompt_ = system_prompt
        self.retry_attempts_ = max( retry_attempts, 1 )
        self.retry_interval_ = max( retry_interval, 1 )
        self.enable_history_ = enable_history
        self.frequency_penalty = frequency_penalty
        self.temperature = temperature
        self.top_p = top_p

        self.conversation_history_ = []  # to store the conversation history if needed

    # TODO: this is not elegent, image urls, conversion histories and some other things mixed here
    #       Optimization required
    def forward(self, user_prompt=None, system_prompt=None, base_url=None, api_key=None, model=None, image_url=None,
                frequency_penalty=None, temperature=None, top_p=None
                ) -> str | None:
        # defaults to the instance variables if not provided
        user_prompt = user_prompt if user_prompt is not None else self.user_prompt_
        system_prompt = system_prompt if system_prompt is not None else self.system_prompt_
        base_url = base_url if base_url is not None else self.base_url_
        api_key = api_key if api_key is not None else self.api_key_
        api_key = api_key if api_key is not None else 'ollama'
        model = model if model is not None else self.model_
        image_url = image_url if image_url is not None else self.image_url_
        frequency_penalty = frequency_penalty if frequency_penalty is not None else self.frequency_penalty
        temperature = temperature if temperature is not None else self.temperature
        top_p = top_p if top_p is not None else self.top_p

        assert user_prompt is not None, "user_prompt must be provided"
        assert base_url is not None, "base_url must be provided"
        assert model is not None, "model must be provided"

        # Prepare messages
        system_message = {"role": "system", "content": system_prompt}
        user_message = {"role": "user", "content": user_prompt}
        if image_url is not None:
            print( f'Ollama called with image_url.' )
            if isinstance(image_url, str) and image_url.strip() != "": # case of a string
                print( 'Ollama called with a single image payload' )
                print( f'Image Payload {image_url[:16]} -- {image_url[-16:]}' )
                user_message = {"role": "user", "content": [{"type":"text", "text":user_prompt},
                                                            {"type":"image_url", "image_url": {"url": image_url}}]}
            else:
                print(f'Error: Ollama: There are multiple images as payloads.')
                print('Error: Ollama has problem handling multiple images currently.')
                print(f'Error: Merged images into a single image_url payload instead.')
                return None

        if  0 == len(self.conversation_history_): # add system message only once
            self.conversation_history_.append( system_message )
        self.conversation_history_.append( user_message )

        try:
            client = OpenAI(api_key=api_key, base_url=base_url, max_retries=self.retry_attempts_)

            response = client.chat.completions.create( model=model, messages=self.conversation_history_,
                                                       frequency_penalty=frequency_penalty,
                                                       temperature=temperature,
                                                       top_p=top_p
                                                      )
            ans = response.choices[0].message.content
            if self.enable_history_:
                self.conversation_history_.append({"role": "assistant", "content": ans})
            return ans

        except Exception as e:
            print(f"Error during LLM call: {str(e)}")
            return None


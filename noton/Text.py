from noton.Module import Module

class Text(Module):
    def __init__(self):
        super().__init__()


class TextFilter(Text):
    '''
    A module that removes all text before and including a specified tag.
    '''
    def __init__(self, tag:str = "</think>"):
        super().__init__()
        self.tag_ = tag

    def forward(self, txt:str, tag=None) -> str:

        tag = tag if tag is not None else self.tag_

        try:
            # Find the position of the tag
            pos = txt.find(tag)
            if pos == -1:
                # Tag not found, return original text
                return txt
            else:
                # Return everything after the tag
                return txt[pos + len(tag):]
        except Exception:
            # Fallback to returning original text in case of any error
            return txt

class TextReplacer(Text):
    def __init__(self, tag:str = "```", replacer:str=""):
        super().__init__()
        self.tag_ = tag
        self.replacer_ = replacer
    def forward(self, txt:str, tag=None, replacer=None) -> str:

        tag = tag if tag is not None else self.tag_
        replacer = replacer if replacer is not None else self.replacer_

        if tag is None:
            return txt

        # replace all tag in txt
        ans = txt.replace(tag, replacer)
        return ans


if __name__ == "__main__":
    text = "Hello, this is a sample text.</think> This part should be returned."
    filter = TextFilter()
    result = filter.forward(text)
    print(result)  # Output: " This part should be returned."

    text = "Hello, this is a sample text. The entire string should be returned."
    filter = TextFilter()
    result = filter.forward(text)
    print(result)  # Output "Hello, this is a sample text. The entire string should be returned."

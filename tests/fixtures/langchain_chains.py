"""Fixture: classic LangChain LLMChain constructors (not LangGraph)."""

from langchain.chains import LLMChain, SequentialChain
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

extract_prompt = PromptTemplate(
    input_variables=["doc"],
    template="Extract key facts from: {doc}",
)
validate_prompt = PromptTemplate(
    input_variables=["facts"],
    template="Validate these facts and list issues: {facts}",
)

extract_chain = LLMChain(
    llm=ChatOpenAI(model="gpt-4o"),
    prompt=extract_prompt,
    output_key="facts",
)
validate_chain = LLMChain(
    llm=ChatOpenAI(model="gpt-4o-mini"),
    prompt=validate_prompt,
    output_key="issues",
)

pipeline = SequentialChain(
    chains=[extract_chain, validate_chain],
    input_variables=["doc"],
    output_variables=["facts", "issues"],
)

"""Fixture: linear LangGraph — extract then summarize."""

from typing import TypedDict

from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph


class DocState(TypedDict):
    text: str
    entities: str
    summary: str


extract_llm = ChatOpenAI(model="gpt-4o")
summarize_llm = ChatOpenAI(model="gpt-4o-mini")


def extract_entities(state: DocState) -> dict:
    result = extract_llm.invoke(f"Extract named entities from: {state['text']}")
    return {"entities": result.content}


def summarize(state: DocState) -> dict:
    result = summarize_llm.invoke(f"Summarize: {state['text']}")
    return {"summary": result.content}


graph = StateGraph(DocState)
graph.add_node("extract_entities", extract_entities)
graph.add_node("summarize", summarize)
graph.add_edge(START, "extract_entities")
graph.add_edge("extract_entities", "summarize")
graph.add_edge("summarize", END)

app = graph.compile()

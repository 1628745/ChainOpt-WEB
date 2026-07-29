"""Fixture: branching LangGraph with a router and two specialist nodes."""

from typing import Literal, TypedDict

from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, StateGraph


class TicketState(TypedDict):
    ticket: str
    route: str
    answer: str


router_llm = ChatOpenAI(model="gpt-4o-mini")
billing_llm = ChatAnthropic(model="claude-sonnet-4-20250514")
tech_llm = ChatOpenAI(model="gpt-4o")


def classify(state: TicketState) -> dict:
    result = router_llm.invoke(f"Classify as billing or tech: {state['ticket']}")
    label = "billing" if "billing" in result.content.lower() else "tech"
    return {"route": label}


def handle_billing(state: TicketState) -> dict:
    result = billing_llm.invoke(f"Answer billing question: {state['ticket']}")
    return {"answer": result.content}


def handle_tech(state: TicketState) -> dict:
    result = tech_llm.invoke(f"Answer tech question: {state['ticket']}")
    return {"answer": result.content}


def pick_route(state: TicketState) -> Literal["handle_billing", "handle_tech"]:
    return "handle_billing" if state["route"] == "billing" else "handle_tech"


builder = StateGraph(TicketState)
builder.add_node("classify", classify)
builder.add_node("handle_billing", handle_billing)
builder.add_node("handle_tech", handle_tech)
builder.add_edge(START, "classify")
builder.add_conditional_edges("classify", pick_route)
builder.add_edge("handle_billing", END)
builder.add_edge("handle_tech", END)

app = builder.compile()

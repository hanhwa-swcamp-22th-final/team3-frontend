# Base Components

This directory contains reusable, presentation-focused base UI components.

## Structure

- `display`: stat cards, banners, badges, empty states
- `navigation`: tabs, toolbars, pagination
- `overlay`: modal primitives and modal wrappers
- `data-display`: tables and notification/list primitives

## Rules

- Keep these components UI-only.
- Do not import Pinia stores here.
- Do not call Axios or other API clients here.
- Pass display-ready data through props.
- Emit generic UI events only.

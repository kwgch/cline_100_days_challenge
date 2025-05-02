# Tech Context

## Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Machine Learning:** TensorFlow.js (`@tensorflow/tfjs`)
- **Tokenizer:** `@xenova/transformers`
- **Visualization:** D3.js
- **UI Framework:** Vanilla JS (Initially)
- **Development Environment:** Node.js, npm/yarn, Webpack/Vite (Potentially)

## Development Setup
- The project will be developed using VSCode.
- The TensorFlow.js model is located in the `distilbert_tfjs_model/` directory.
- The `@xenova/transformers` and D3.js libraries will be included via CDN.

## Technical Constraints
- The application must run in the browser.
- The model size and computational complexity may impact performance.
- Memory management is crucial to avoid leaks.
- The tokenizer must be compatible with the DistilBERT model.

## Dependencies
- `@tensorflow/tfjs` (via CDN)
- `@xenova/transformers` (via CDN)
- D3.js (via CDN)

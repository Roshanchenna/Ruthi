import { useState } from "react";
import { Switch } from "@nextui-org/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = BACKEND_URL + "/api/";

// Edit Configurations Main Area
export function ConfigurationsMain() {
  const [chatGPTEnabled, setChatGPTEnabled] = useState(true);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-black mb-4">Configurations</h1>
      <Switch
        checked={chatGPTEnabled}
        onChange={(val) => setChatGPTEnabled(val)}
        size="small"
        className="mb-4"
      >
        ChatGPT Evaluation
      </Switch>
      {/* Add more configuration options here */}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./App.css";
import { getAwsSdkVersions } from "./getVersions";
import axios from "axios";
import { VersionSelector, useVersionSelector } from "./versionSelector";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Paper,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#232f3e", // AWS dark blue
    },
    secondary: {
      main: "#ff9900", // AWS orange
    },
  },
});

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [executionResult, setExecutionResult] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [versions, setVersions] = useState([]);
  const languages = ["javascript", "python", "java", "c++", "ruby"];
  useEffect(() => {
    async function loadVersions() {
      try {
        const fetchedVersions = await getAwsSdkVersions();
        setVersions(fetchedVersions);
        if (fetchedVersions.length > 0) {
          setSelectedVersion(fetchedVersions[0]);
        }
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    }

    loadVersions();
  }, []);
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const generateRepro = async (originalCode, language, selectedVersion) => {
    // Simulate an asynchronous operation (e.g., API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For this example, we'll just add a comment to the original code
    console.log("originalcode", originalCode);
    return `// Generated repro for ${language} version ${selectedVersion}\n${originalCode}`;
  };
  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
  };
  // In your React component
  const handleGenerateRepro = async () => {
    setIsGenerating(true);
    setExecutionResult("");
    try {
      const response = await axios.post(
        "http://localhost:3001/api/write-file",
        { content: code }
      );
      console.log(response.data.message);

      let result = "";
      if (response.data.output) {
        result += "Output:\n" + response.data.output + "\n\n";
      }
      if (response.data.error) {
        result += "Error:\n" + response.data.error;
      }

      setExecutionResult(result);
      alert(
        "Repro generated, saved to index.js, packages installed, and executed"
      );
    } catch (error) {
      console.error("Error generating repro:", error);
      setExecutionResult("Failed to generate repro: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">AWS SDK Code Repro Generator</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
              labelId="language-select-label"
              id="language-select"
              value={selectedLanguage}
              label="Language"
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="version-select-label">SDK Version</InputLabel>
            <Select
              labelId="version-select-label"
              id="version-select"
              value={selectedVersion}
              label="SDK Version"
              onChange={handleVersionChange}
            >
              {versions.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={code}
          onChange={handleCodeChange}
          placeholder={`Enter your ${selectedLanguage} code here...`}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGenerateRepro}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Repro"}
          </Button>
        </Box>
        {executionResult && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Execution Result:
            </Typography>
            <Typography
              component="pre"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}
            >
              {executionResult}
            </Typography>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;

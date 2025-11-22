#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function extractIterationGoal(content) {
    const idMatch = content.match(/[-*]\s+\*\*Iteration ID:\*\*\s+`([^`]+)`/);
    const iterationId = idMatch ? idMatch[1] : "";
    const goalMatch = content.match(/[-*]\s+\*\*Goal:\*\*\s+(.+?)(?=\n[-*]|\n\n)/s);
    const iterationGoal = goalMatch ? goalMatch[1].trim() : "";
    return { iterationId, iterationGoal };
}

function parseTask(taskText, iterationId, iterationGoal) {
    const task = {
        task_id: "",
        iteration_id: iterationId,
        iteration_goal: iterationGoal,
        description: "",
        agent_type_hint: "",
        inputs: "",
        target_files: [],
        input_files: [],
        deliverables: "",
        acceptance_criteria: "",
        dependencies: [],
        parallelizable: false,
        done: false
    };

    const idMatch = taskText.match(/[-*]\s+\*\*Task ID:\*\*\s+`([^`]+)`/);
    if (idMatch) task.task_id = idMatch[1];

    const descMatch = taskText.match(/[-*]\s+\*\*Description:\*\*\s+(.+?)(?=\n\s+[-*]\s+\*\*|\n[-*]\s+\*\*)/s);
    if (descMatch) task.description = descMatch[1].trim();

    const agentMatch = taskText.match(/[-*]\s+\*\*Agent Type Hint:\*\*\s+`([^`]+)`/);
    if (agentMatch) task.agent_type_hint = agentMatch[1];

    const inputsMatch = taskText.match(/[-*]\s+\*\*Inputs:\*\*\s+(.+?)(?=\n\s+[-*]\s+\*\*|\n[-*]\s+\*\*)/s);
    if (inputsMatch) task.inputs = inputsMatch[1].trim();

    const inputFilesMatch = taskText.match(/[-*]\s+\*\*Input Files:\*\*\s+(\[.*?\])/s);
    if (inputFilesMatch) {
        try {
            task.input_files = JSON.parse(inputFilesMatch[1].replace(/\n/g, '').replace(/\s+/g, ' '));
        } catch (e) {
            const files = inputFilesMatch[1].match(/[`"]([^`"]+)[`"]?/g);
            task.input_files = files ? files.map(f => f.replace(/[`"]+/g, '')) : [];
        }
    }

    const targetFilesMatch = taskText.match(/[-*]\s+\*\*Target Files:\*\*\s+(\[.*?\])/s);
    if (targetFilesMatch) {
        try {
            task.target_files = JSON.parse(targetFilesMatch[1].replace(/\n/g, '').replace(/\s+/g, ' '));
        } catch (e) {
            const files = targetFilesMatch[1].match(/[`"]([^`"]+)[`"]?/g);
            task.target_files = files ? files.map(f => f.replace(/[`"]+/g, '')) : [];
        }
    }

    const delivMatch = taskText.match(/[-*]\s+\*\*Deliverables:\*\*\s+(.+?)(?=\n\s+[-*]\s+\*\*|\n[-*]\s+\*\*)/s);
    if (delivMatch) task.deliverables = delivMatch[1].trim();

    const acceptMatch = taskText.match(/[-*]\s+\*\*Acceptance Criteria:\*\*\s+(.+?)(?=\n\s+[-*]\s+\*\*|\n[-*]\s+\*\*)/s);
    if (acceptMatch) task.acceptance_criteria = acceptMatch[1].trim();

    const depMatch = taskText.match(/[-*]\s+\*\*Dependencies:\*\*\s+(.+?)(?=\n\s+[-*]\s+\*\*|\n[-*]\s+\*\*|\n\n|$)/s);
    if (depMatch) {
        const depText = depMatch[1].trim();
        if (depText.toLowerCase() === "none") {
            task.dependencies = [];
        } else {
            const deps = depText.match(/`([^`]+)`/g);
            task.dependencies = deps ? deps.map(d => d.replace(/`/g, '')) : [];
        }
    }

    const parallelMatch = taskText.match(/[-*]\s+\*\*Parallelizable:\*\*\s+(Yes|No)/i);
    if (parallelMatch) task.parallelizable = parallelMatch[1].toLowerCase() === "yes";

    return task;
}

function parseIterationFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    const { iterationId, iterationGoal } = extractIterationGoal(content);
    const taskPattern = /<!-- anchor: task-[^>]+ -->(.+?)(?=<!-- anchor: task-|$)/gs;
    const taskMatches = [...content.matchAll(taskPattern)];

    const tasks = [];
    for (const match of taskMatches) {
        const task = parseTask(match[1], iterationId, iterationGoal);
        if (task.task_id) tasks.push(task);
    }
    return tasks;
}

function createManifest(outputDir, taskFiles) {
    const manifest = {
        description: "Manifest of all iteration task files",
        total_iterations: taskFiles.length,
        task_files: taskFiles.sort(),
        generated_at: "auto-generated"
    };

    const manifestPath = path.join(outputDir, "tasks_manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✓ Created manifest: $`);
}

function main() {
    const planDir = path.join(".codemachine", "artifacts", "plan");
    const outputDir = path.join(".codemachine", "artifacts", "tasks");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const files = fs.readdirSync(planDir);
    const iterationFiles = files
        .filter(f => /^02_Iteration_I\d+\.md$/.test(f))
        .sort()
        .map(f => path.join(planDir, f));

    if (iterationFiles.length === 0) {
        console.log("⚠ No iteration files found in .codemachine/artifacts/plan");
        return;
    }

    const taskFiles = [];
    for (const iterationFile of iterationFiles) {
        const tasks = parseIterationFile(iterationFile);
        if (tasks.length === 0) continue;
        const iterationMatch = path.basename(iterationFile).match(/I(\d+)/);
        const outputFilename = iterationMatch ? `tasks_I${iterationMatch[1]}.json` : `tasks_${path.parse(iterationFile).name}.json`;
        const outputPath = path.join(outputDir, outputFilename);
        fs.writeFileSync(outputPath, JSON.stringify(tasks, null, 2));
        taskFiles.push(outputFilename);
    }

    createManifest(outputDir, taskFiles);
    console.log(`✓ Conversion complete! Output is in $`);
}

if (require.main === module) main();

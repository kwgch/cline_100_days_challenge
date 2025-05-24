document.addEventListener('DOMContentLoaded', () => {
    const svg = d3.select("#d3-canvas");
    let width = +svg.node().getBoundingClientRect().width;
    let height = +svg.node().getBoundingClientRect().height;

    const numCircles = 150; // Increased number of colorful circles
    const baseRadius = 6; // Even smaller for more circles
    const excitedColor = "#ff4500";
    const normalColors = ["#4682b4", "#3cb371", "#ffd700", "#9370db", "#ffa07a", "#6a5acd", "#ff7f50", "#20b2aa"];
    
    const excitationDuration = 3000;
    const excitationSpreadRadius = 40; // Slightly smaller spread radius due to more circles
    const excitationChance = 0.35;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let nodes = d3.range(numCircles).map(i => ({
        id: `node-${i}`,
        r: baseRadius,
        originalColor: normalColors[getRandomInt(0, normalColors.length - 1)],
        isExcited: false,
        excitationEndTime: 0,
        x: Math.random() * width,
        y: Math.random() * height
    }));

    let simulation = d3.forceSimulation(nodes)
        .velocityDecay(0.15) // Lowered for more inertia
        .force("charge", d3.forceManyBody().strength(d => d.isExcited ? -20 : 5)) // Adjusted charge
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.015)) // Slightly weaker center
        .force("collision", d3.forceCollide().radius(d => d.r * (d.isExcited ? 1.5 : 1) + 1).strength(0.7)) // Collision based on visual radius
        .on("tick", ticked);

    let circles = svg.selectAll("circle")
        .data(nodes, d => d.id)
        .enter().append("circle")
        .attr("r", d => d.r)
        .style("fill", d => d.originalColor)
        .style("cursor", "pointer")
        .on("click", handleClick)
        .call(drag(simulation));

    function ticked() {
        const currentTime = Date.now();
        nodes.forEach(node => {
            // Boundary constraints
            const visualRadius = node.r * (node.isExcited ? 1.5 : 1);
            if (node.x - visualRadius < 0) {
                node.x = visualRadius;
                if (node.vx) node.vx *= -0.7; // More elastic bounce
            } else if (node.x + visualRadius > width) {
                node.x = width - visualRadius;
                if (node.vx) node.vx *= -0.7;
            }
            if (node.y - visualRadius < 0) {
                node.y = visualRadius;
                if (node.vy) node.vy *= -0.7;
            } else if (node.y + visualRadius > height) {
                node.y = height - visualRadius;
                if (node.vy) node.vy *= -0.7;
            }

            // Manage excitation state
            if (node.isExcited && currentTime > node.excitationEndTime) {
                node.isExcited = false;
            }

            // Attempt to spread excitement
            if (node.isExcited) {
                nodes.forEach(otherNode => {
                    if (node.id === otherNode.id || otherNode.isExcited) return;
                    
                    const dx = node.x - otherNode.x;
                    const dy = node.y - otherNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < excitationSpreadRadius && Math.random() < excitationChance) {
                        otherNode.isExcited = true;
                        otherNode.excitationEndTime = currentTime + excitationDuration;
                    }
                });
            }
        });
        
        simulation.nodes(nodes);
        if (simulation.alpha() < 0.1 && nodes.some(n => n.isExcited)) simulation.alpha(0.1).restart();

        circles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", d => d.r * (d.isExcited ? 1.5 : 1)) // Visual radius update
            .style("fill", d => d.isExcited ? excitedColor : d.originalColor)
            .style("stroke", d => d.isExcited ? "rgba(255,255,255,0.7)" : "none")
            .style("stroke-width", d => d.isExcited ? 2 : 0);
    }

    function handleClick(event, d) {
        d.isExcited = true;
        d.excitationEndTime = Date.now() + excitationDuration;
        d.vx += (Math.random() - 0.5) * 12; // Slightly stronger impulse
        d.vy += (Math.random() - 0.5) * 12;
        simulation.alpha(0.4).restart(); // Reheat more
    }

    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0); 

            if (d.isExcited) {
                setTimeout(() => {
                    d.fx = null;
                    d.fy = null;
                }, 150); // Shorter delay for excited nodes
            } else {
                d.fx = null;
                d.fy = null;
            }
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // Resize handling
    window.addEventListener('resize', () => {
        width = +svg.node().getBoundingClientRect().width;
        height = +svg.node().getBoundingClientRect().height;
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.alpha(0.5).restart();
    });
});

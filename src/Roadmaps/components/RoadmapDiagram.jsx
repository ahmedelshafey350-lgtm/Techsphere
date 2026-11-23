import React, { useMemo, useRef, useState } from 'react';
import StageCard from './StageCard';
import TopicPill from './TopicPill';
import NodeModal from './NodeModal';

export default function RoadmapDiagram({ nodes, language }) {
    const isEnglish = language === 'en';
    const [openItem, setOpenItem] = useState(null);

    // Build ordered stage list from the `next` chain starting at type "start"
    const orderedStages = useMemo(() => {
        const byId = {};
        nodes.forEach((n) => {
            byId[n.id] = n;
        });

        const start = nodes.find((n) => n.type === 'start');
        if (!start) return [];

        const ordered = [start];
        let current = start;
        const visited = new Set([start.id]);

        while (current.next && current.next.length > 0) {
            const nextId = current.next[0];
            if (!nextId || visited.has(nextId)) break;
            const nextNode = byId[nextId];
            if (!nextNode) break;
            ordered.push(nextNode);
            visited.add(nextId);
            current = nextNode;
        }

        return ordered;
    }, [nodes]);

    const isLast = (index) => index === orderedStages.length - 1;

    const openStage = (stage) => {
        setOpenItem({ type: 'stage', stage });
    };

    const openTopic = (stage, topic) => {
        setOpenItem({ type: 'topic', stage, topic });
    };

    const isOpen = !!openItem;

    return (
        <div className="rm-spine-container">
            <ol className="rm-spine-list">
                {orderedStages.map((stage, index) => {
                    const topics = Array.isArray(stage.topics) ? stage.topics : [];
                    const showConnector = !isLast(index);

                    // Split topics into left/right columns for alternating layout
                    const leftTopics = [];
                    const rightTopics = [];
                    topics.forEach((topic, i) => {
                        const isLeft = i % 2 === 0;
                        if (isEnglish ? isLeft : !isLeft) {
                            leftTopics.push({ topic, index: i });
                        } else {
                            rightTopics.push({ topic, index: i });
                        }
                    });

                    return (
                        <li key={stage.id} className="rm-spine-item">
                            <StageCard
                                stage={stage}
                                isEnglish={isEnglish}
                                isOpen={openItem?.type === 'stage' && openItem?.stage?.id === stage.id}
                                onClick={() => openStage(stage)}
                            />
                            {topics.length > 0 && (
                                <div className="rm-topic-row">
                                    {leftTopics.map(({ topic, index: ti }) => (
                                        <TopicPill
                                            key={topic.title.en + topic.title.ar + ti}
                                            topic={topic}
                                            index={ti}
                                            side="left"
                                            isEnglish={isEnglish}
                                            onClick={() => openTopic(stage, topic)}
                                        />
                                    ))}
                                    {rightTopics.map(({ topic, index: ti }) => (
                                        <TopicPill
                                            key={topic.title.en + topic.title.ar + ti}
                                            topic={topic}
                                            index={ti}
                                            side="right"
                                            isEnglish={isEnglish}
                                            onClick={() => openTopic(stage, topic)}
                                        />
                                    ))}
                                </div>
                            )}
                            {showConnector && (
                                <div className="rm-spine-connector" aria-hidden="true" />
                            )}
                        </li>
                    );
                })}
            </ol>

            {openItem && (
                <NodeModal
                    node={openItem.type === 'stage' ? openItem.stage : openItem.topic}
                    isOpen
                    onClose={() => setOpenItem(null)}
                    courseId={openItem.type === 'stage' ? openItem.stage.courseId : null}
                    project={openItem.type === 'topic' ? openItem.stage.project : undefined}
                    isTopic={openItem.type === 'topic'}
                    stageTitle={
                        openItem.type === 'topic'
                            ? (isEnglish ? openItem.stage.title.en : openItem.stage.title.ar)
                            : null
                    }
                />
            )}
        </div>
    );
}

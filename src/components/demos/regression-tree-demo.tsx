"use client";

import { useMemo, useState } from "react";
import { SliderField } from "@/components/ui/slider-field";
import { generateTemperature, temperatureTruth } from "@/lib/ml/datasets";
import { rootMeanSquaredError } from "@/lib/ml/metrics";
import { fitRegressionTree, predictValue, treeStats } from "@/lib/ml/tree";
import { DemoLayout, Legend, LiveRegion, Stat } from "./demo-ui";
import { linePath, Plot } from "./plot";
import { TreeDiagram } from "./tree-ui";

export default function RegressionTreeDemo() {
  const { train, test } = useMemo(() => generateTemperature(), []);
  const [depthSetting, setDepthSetting] = useState(2);
  const [minLeaf, setMinLeaf] = useState(1);
  const maxDepth = depthSetting >= 13 ? Infinity : depthSetting;

  const tree = useMemo(
    () => fitRegressionTree(train.map((p) => [p.x]), train.map((p) => p.y), { maxDepth, minSamplesLeaf: minLeaf }),
    [train, maxDepth, minLeaf],
  );
  const stats = treeStats(tree);
  const steps = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 960; i++) {
      const x = (i / 960) * 24;
      pts.push({ x, y: predictValue(tree, [x]) });
    }
    return pts;
  }, [tree]);
  const truth = Array.from({ length: 97 }, (_, i) => ({ x: i / 4, y: temperatureTruth(i / 4) }));
  const rmse = (pts: typeof train) => rootMeanSquaredError(pts.map((p) => p.y), pts.map((p) => predictValue(tree, [p.x])));
  const trainRmse = rmse(train);
  const testRmse = rmse(test);

  return (
    <DemoLayout
      plot={
        <div className="space-y-3">
          <Plot
            height={320}
            xDomain={[0, 24]}
            yDomain={[0, 25]}
            xTicks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
            xLabel="Saat"
            yLabel="Temperatur (°C)"
            ariaLabel={`Temperatur məlumatı və reqressiya ağacının pilləli proqnozu: ${stats.leaves} yarpaq, test RMSE ${testRmse.toFixed(2)}.`}
          >
            {(s) => (
              <g>
                {train.map((p, i) => (
                  <circle key={i} cx={s.x(p.x)} cy={s.y(p.y)} r={3} fill="var(--chart-1)" opacity={0.45} />
                ))}
                <path d={linePath(truth, s)} stroke="var(--chart-3)" strokeWidth={1.8} strokeDasharray="5 4" fill="none" />
                <path d={linePath(steps, s)} stroke="var(--chart-4)" strokeWidth={2.4} fill="none" />
              </g>
            )}
          </Plot>
          <Legend
            items={[
              { label: "Təlim nöqtələri", swatch: <circle cx={7} cy={7} r={4} fill="var(--chart-1)" opacity={0.6} /> },
              { label: "Ağacın proqnozu (yarpaq ortası)", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-4)" strokeWidth={2.5} /> },
              { label: "Həqiqi əyri", swatch: <line x1={1} y1={7} x2={13} y2={7} stroke="var(--chart-3)" strokeWidth={2} strokeDasharray="3 2" /> },
            ]}
          />
          <TreeDiagram root={tree} featureNames={["saat"]} maxShownDepth={3} />
        </div>
      }
      controls={
        <>
          <SliderField label="max_depth" value={depthSetting} min={1} max={13} onChange={setDepthSetting} format={(v) => (v >= 13 ? "None" : String(v))} />
          <SliderField label="min_samples_leaf" value={minLeaf} min={1} max={30} onChange={setMinLeaf} />
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Yarpaq" value={stats.leaves} />
            <Stat label="Dərinlik" value={stats.depth} />
            <Stat label="Təlim RMSE" value={trainRmse.toFixed(2)} />
            <Stat label="Test RMSE" value={testRmse.toFixed(2)} tone={testRmse - trainRmse > 0.5 ? "bad" : "neutral"} />
          </div>
          <LiveRegion>
            Hər yarpaq bir sabit qiymət — oradakı təlim nümunələrinin ortası — proqnozlaşdırır, ona görə də əyri pilləlidir. Ağac MSE-ni minimallaşdıran
            hədləri seçir. Məhdudiyyətsiz ağac hər nöqtəyə ayrıca “pillə” qurur: təlim xətası 0 olur, test xətası isə artır.
          </LiveRegion>
        </>
      }
    />
  );
}

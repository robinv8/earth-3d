"use client";
import styles from "./Dashboard.module.css";
import { ParkMap3D } from "./ParkMap3D";

export function Dashboard() {
	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.weatherInfo}>
					<span>杭州</span>
					<span>26°C</span>
					<span>多云转晴</span>
				</div>
				<h1 className={styles.title}>智慧小区可视化系统</h1>
				<div className={styles.timestamp}>2024-12-19 23:10:15</div>
			</header>

			<main className={styles.main}>
				<aside className={styles.leftSidebar}>
					<section className={styles.parkIntro}>
						<h2>小区概况</h2>
						<div className={styles.videoPlaceholder}></div>
					</section>

					<section className={styles.parkOverview}>
						<div className={styles.progressCircle}>
							<div className={styles.progressValue}>92%</div>
						</div>
						<div className={styles.areaStats}>
							<div>
								<span>小区总户数</span>
								<span>1256 户</span>
							</div>
							<div>
								<span>入住户数</span>
								<span>1156 户</span>
							</div>
						</div>
					</section>

					<section className={styles.parkScale}>
						<table>
							<tbody>
								<tr>
									<td>住宅楼栋</td>
									<td>12</td>
								</tr>
								<tr>
									<td>停车位</td>
									<td>800</td>
								</tr>
								<tr>
									<td>充电桩</td>
									<td>120</td>
								</tr>
								<tr>
									<td>监控点位</td>
									<td>156</td>
								</tr>
								<tr>
									<td>门禁设备</td>
									<td>68</td>
								</tr>
								<tr>
									<td>消防设备</td>
									<td>245</td>
								</tr>
							</tbody>
						</table>
					</section>
				</aside>

				<section className={styles.mapContainer}>
					<ParkMap3D />
				</section>

				<aside className={styles.rightSidebar}>
					<section className={styles.gdpSection}>
						<h2>物业费用收缴</h2>
						<div className={styles.gdpValue}>98.5%</div>
						<div className={styles.gdpChart}></div>
					</section>

					<section className={styles.companiesSection}>
						<h2>车辆统计</h2>
						<div className={styles.companyCount}>652 辆</div>
						<div className={styles.vehicleStats}>
							<div>
								<span>固定车位</span>
								<span>580</span>
							</div>
							<div>
								<span>临时车位</span>
								<span>72</span>
							</div>
						</div>
					</section>

					<section className={styles.industrySection}>
						<h2>能耗统计</h2>
						<div className={styles.barChart}></div>
					</section>
				</aside>
			</main>

			<footer className={styles.footer}>
				<nav>
					<button>设备运维</button>
					<button>物业管理</button>
					<button>小区总览</button>
					<button>安防监控</button>
					<button>访客系统</button>
				</nav>
			</footer>
		</div>
	);
}

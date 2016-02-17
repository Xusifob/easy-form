<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>
<!--
@Updated : V 0.5.5
-->
<div class="wrap gf_browser_chrome">
    <div class="tab-head panel-wordpress">
        <div class="head">
            <h2><?php _e("Filtres", 'easy-form'); ?></h2>
        </div>
        <form action="#">
            <div class="row">
                <a href="#null" id="plus"><?php _e("Plus de filtres", 'easy-form'); ?></a>
                <div class="col-sm-3">
                    <label for="form-id"><?php _e("Choix du formulaire", 'easy-form'); ?></label>
                    <select name="id" id="form-id">
                        <option
                            value="<?php echo $_GET['id']; ?>"><?php _e("Séléctionnez votre formulaire", 'easy-form'); ?></option>
                        <?php /** @var WP_Post $oneForm * */
                        foreach ($my_query->get_posts() as $oneForm) { ?>
                            <option <?php echo $oneForm->ID == $_GET['id'] ? 'selected' : ''; ?>
                                value="<?php echo $oneForm->ID; ?>"><?php echo $oneForm->post_title; ?></option>
                        <?php } ?>
                    </select>
                </div>
                <?php if (isset($convs['custom_datas']) && is_array($convs['custom_datas'])) { ?>
                    <div class="col-sm-3">
                        <label for="form-id"><?php _e("Tri customisé", 'easy-form'); ?></label>
                        <select name="custom_data" id="form-id">
                            <option value=""><?php _e("Séléctionnez une valeur", 'easy-form'); ?></option>
                            <?php /** @var WP_Post $oneForm * */
                            foreach ($convs['custom_datas'] as $data) { ?>
                                <option <?php echo $data == $_GET['custom_data'] ? 'selected' : ''; ?>
                                    value="<?php echo $data; ?>"><?php echo $data; ?></option>
                            <?php } ?>
                        </select>
                    </div>
                <?php } ?>
            </div>
            <input type="hidden" name="page" value="<?php echo $_GET['page']; ?>">
            <div id="filter-plus" style="display: none;" >
            <div class="row mg-top-25" >
                <div class="col-sm-3">
                    <label for="period"><?php _e("Période à afficher", 'easy-form'); ?></label>
                    <select name="period" id="period">
                        <option
                            value="1 day ago" <?php echo isset($_GET['period']) && $_GET['period'] == '1 day ago' ? 'selected' : ''; ?> ><?php _e("1 jour", 'easy-form'); ?></option>
                        <option
                            value="1 week ago" <?php echo isset($_GET['period']) && $_GET['period'] == '1 week ago' ? 'selected' : ''; ?> ><?php _e("1 semaine", 'easy-form'); ?></option>
                        <option
                            value="1 month ago" <?php echo (isset($_GET['period']) && $_GET['period'] == '1 month ago' || !isset($_GET['period'])) ? 'selected' : ''; ?> ><?php _e("1 mois", 'easy-form'); ?></option>
                        <option
                            value="1 year ago" <?php echo isset($_GET['period']) && $_GET['period'] == '1 year ago' ? 'selected' : ''; ?> ><?php _e("1 an", 'easy-form'); ?></option>
                    </select>
                </div>
                <div class="col-sm-3">
                    <label for="groupby"><?php _e("Grouper par", 'easy-form'); ?></label>
                    <select name="groupby" id="groupby">
                        <option
                            value="days" <?php echo isset($_GET['groupby']) && $_GET['groupby'] == 'days' ? 'selected' : ''; ?> ><?php _e("Jours", 'easy-form'); ?></option>
                        <option
                            value="hours" <?php echo isset($_GET['groupby']) && $_GET['groupby'] == 'hours' ? 'selected' : ''; ?> ><?php _e("Heures", 'easy-form'); ?></option>
                        <option
                            value="weeks" <?php echo isset($_GET['groupby']) && $_GET['groupby'] == 'weeks' ? 'selected' : ''; ?> ><?php _e("Semaines", 'easy-form'); ?></option>
                        <option
                            value="years" <?php echo isset($_GET['groupby']) && $_GET['groupby'] == 'years' ? 'selected' : ''; ?> ><?php _e("An", 'easy-form'); ?></option>
                    </select>
                </div>
                <div class="col-sm-3">
                    <label for="format"><?php _e("Format de date", 'easy-form'); ?> <a
                            href="http://php.net/manual/en/function.date.php" class="small-info"
                            target="_blank"><?php _e("Quel format&nbsp;?", 'easy-form'); ?></a></label>
                    <input type="text" name="format" class="form-control"
                           placeholder="<?php _e("Format de date", 'easy-form'); ?>"
                           value="<?php echo isset($_GET['format']) ? $_GET['format'] : 'd/m/Y'; ?>">
                </div>
            </div>
            <div class="row margin-top-25">
                <div class="col-sm-3">
                    <label for="unique">
                        <input
                            type="checkbox" <?php echo isset($_GET['unique']) && $_GET['unique'] == 'true' ? 'checked' : ''; ?>
                            id="unique" value="true" name="unique">
                        <?php _e("Visiteurs uniques", 'easy-form'); ?>
                    </label>
                </div>
                <div class="col-sm-3">
                    <label for="include_my_ip">
                        <input
                            type="checkbox" <?php echo isset($_GET['include_my_ip']) && $_GET['include_my_ip'] == 'true' ? 'checked' : ''; ?>
                            id="include_my_ip" value="true" name="include_my_ip">
                        <?php _e("Prendre en compte mes visites", 'easy-form'); ?>
                    </label>
                </div>
            </div>
            </div>
            <div class="row mg-top-25">
                <div class="col-sm-3">
                    <input type="submit" class="button button-primary button-large"
                           value="<?php _e("Filtrer", 'easy-form'); ?>">
                </div>
            </div>
        </form>
    </div>
    <?php if (isset($form)): ?>
    <!-- Color panels -->
    <div class="row">
        <div class="col-sm-4 col-md-3">
            <div class="tab-head panel-wordpress panel-blue datas">
                <div class="head">
                    <h2><?php _e("Taux de conversion", 'easy-form'); ?></h2>
                </div>
                <i class="fa fa-area-chart"></i>
                <h3 class="bigtitle"><?php echo  $imps['total'] != 0 ? number_format(($convs['total'] / $imps['total']) * 100, 2) : '-' ; ?>
                    <span>%</span></h3>
                <div class="row"></div>
            </div>
        </div>
        <div class="col-sm-4 col-md-3">
            <div class="tab-head panel-wordpress panel-red datas">
                <div class="head">
                    <h2><?php _e("Nombre d'impression", 'easy-form'); ?></h2>
                </div>
                <i class="fa fa-eye"></i>
                <h3 class="bigtitle"><?php echo $imps['total']; ?><span><?php _e("vues", 'easy-form'); ?></span></h3>
                <div class="row"></div>
            </div>
        </div>
        <div class="col-sm-4 col-md-3">
            <div class="tab-head panel-wordpress panel-green datas">
                <div class="head">
                    <h2><?php _e("Nombre de conversion", 'easy-form'); ?></h2>
                </div>
                <i class="fa fa-mouse-pointer"></i>
                <h3 class="bigtitle"><?php echo $convs['total']; ?><span><?php _e("conversion", 'easy-form');
                        echo $convs['total'] > 1 ? 's' : ''; ?></span>
                </h3>
                <div class="row"></div>
            </div>
        </div>
        <div class="col-sm-4 col-md-3 hidden-sm">
            <div class="tab-head panel-wordpress panel-yellow datas">
                <div class="head">
                    <h2><?php _e("Nouveaux visiteurs", 'easy-form'); ?></h2>
                </div>
                <i class="fa fa-user-plus"></i>
                <h3 class="bigtitle"><?php echo count($imps['ips']); ?><span><?php _e("visiteur", 'easy-form');
                        echo count($imps['ips']) > 1 ? 's' : ''; ?></span></h3>
                <div class="row"></div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-9">
            <div class="data panel-wordpress">
                <div class="head">
                    <h2><?php _e("Impression et conversions", 'easy-form'); ?></h2>
                </div>
                <canvas id="lines" width="30" height="9"></canvas>
            </div>
        </div>
        <div class="col-sm-3">
            <div class="data panel-wordpress">
                <div class="head">
                    <h2><?php _e("Type de visiteurs total", 'easy-form'); ?></h2>
                </div>
                <p><?php _e("Taux de visiteurs pour les impressions et les conversions", 'easy-form'); ?></p>
                <canvas id="visitors" width="300" height="300"></canvas>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-3">
            <div class="data panel-wordpress">
                <div class="head">
                    <h2><?php _e("Appareils pour impression", 'easy-form'); ?></h2>
                </div>
                <div>
                    <p><?php _e("Types d'appareil pour les impressions", 'easy-form'); ?></p>
                    <canvas id="doughnut-impressions" width="300" height="300"></canvas>
                </div>
            </div>
        </div>
        <div class="col-sm-3">
            <div class="data panel-wordpress">
                <div class="head">
                    <h2><?php _e("Appareils pour conversion", 'easy-form'); ?></h2>
                </div>
                <div>
                    <p><?php _e("Types d'appareil pour les conversions", 'easy-form'); ?></p>
                    <canvas id="doughnut-conversions" width="300" height="300"></canvas>
                </div>
            </div>
        </div>
        <div class="col-sm-3">
            <div class="data panel-wordpress">
                <div class="head">
                    <h2><?php _e("Visiteurs pour impression", 'easy-form'); ?></h2>
                </div>
                <div>
                    <p><?php _e("Types de visiteurs pour les impressions", 'easy-form'); ?></p>
                    <canvas id="visitors-impressions" width="300" height="300"></canvas>
                </div>
            </div>
        </div>
        <div class="col-sm-3">
            <div class="data panel-wordpress">
                <div class="head">
                    <h2><?php _e("Visiteurs pour conversion", 'easy-form'); ?></h2>
                </div>
                <div>
                    <p><?php _e("Types de visiteurs pour les conversions", 'easy-form'); ?></p>
                    <canvas id="visitors-conversions" width="300" height="300"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>
    <script type="text/javascript">

        Chart.defaults.global.responsive = true;
        Chart.defaults.global.maintainAspectRatio = true;


        var legend;

        var lineChart = {
            options: {
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
                bezierCurve: false,
            },
            data: {
                labels: <?php echo json_encode(array_keys($imps['data'])); ?>,
                datasets: [
                    {
                        label: "<?php _e("Conversion", 'easy-form'); ?>",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: <?php echo json_encode(array_values($convs['data'])); ?>
                    },
                    {
                        label: "<?php _e("Impression", 'easy-form'); ?>",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: <?php echo json_encode(array_values($imps['data'])); ?>
                    }
                ]
            },
        };
        // Create the line Chart
        var LineChart = new Chart(document.getElementById("lines").getContext("2d")).Line(lineChart.data, lineChart.options);
        legend = LineChart.generateLegend();
        jQuery('#lines').after(legend);


        var doughnutChart = {
            data: {
                conversions: [
                    {
                        value: <?php echo $convs['devices']['mobile']; ?>,
                        color: "#F7464A",
                        highlight: "#FF5A5E",
                        label: "<?php _e("Mobile", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $convs['devices']['tablet']; ?>,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",
                        label: "<?php _e("Tablette", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $convs['devices']['desktop']; ?>,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: "<?php _e("Ordinateur", 'easy-form'); ?>"
                    }
                ],
                impressions: [
                    {
                        value: <?php echo $imps['devices']['mobile']; ?>,
                        color: "#F7464A",
                        highlight: "#FF5A5E",
                        label: "<?php _e("Mobile", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $imps['devices']['tablet']; ?>,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",
                        label: "<?php _e("Tablette", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $imps['devices']['desktop']; ?>,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: "<?php _e("Ordinateur", 'easy-form'); ?>"
                    }
                ],

                <?php
                $total = $imps['total'] + $convs['total'];
                $ips = count($convs['ips']) + count($imps['ips']);
                ?>
                visitors: [
                    {
                        value: <?php echo $total != 0 ? number_format(($ips / $total) * 100, 0) : 0; ?>,
                        color: "#043582",
                        highlight: "#034FC5",
                        label: "<?php _e("Nouveaux visiteurs", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $total != 0 ? number_format(((1 - $ips / $total) * 100), 0) : 0; ?>,
                        color: "#9BC11E",
                        highlight: "#B1DC23",
                        label: "<?php _e("Anciens visiteurs", 'easy-form'); ?>"
                    }
                ],
                visitors_impressions: [
                    {
                        value: <?php echo $imps['total'] != 0 ? number_format((count($imps['ips']) / $imps['total']) * 100, 0) : 0; ?>,
                        color: "#043582",
                        highlight: "#034FC5",
                        label: "<?php _e("Nouveaux visiteurs", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $imps['total'] != 0 ? number_format(((1 - count($imps['ips']) / $imps['total']) * 100), 0) : 0; ?>,
                        color: "#9BC11E",
                        highlight: "#B1DC23",
                        label: "<?php _e("Anciens visiteurs", 'easy-form'); ?>"
                    }
                ],
                visitors_conversions: [
                    {
                        value: <?php echo $convs['total'] != 0 ? number_format((count($convs['ips']) / $convs['total']) * 100, 0) : 0; ?>,
                        color: "#043582",
                        highlight: "#034FC5",
                        label: "<?php _e("Nouveaux visiteurs", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $convs['total'] != 0 ? number_format(((1 - count($convs['ips']) / $convs['total']) * 100), 0) : 0; ?>,
                        color: "#9BC11E",
                        highlight: "#B1DC23",
                        label: "<?php _e("Anciens visiteurs", 'easy-form'); ?>"
                    }
                ],
            },
            options: {
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
            }
        };


        // Impression & conversions
        var DoughnutChartImpressions = new Chart(document.getElementById("doughnut-impressions").getContext("2d")).Doughnut(doughnutChart.data.impressions, doughnutChart.options);
        var DoughnutChartConversions = new Chart(document.getElementById("doughnut-conversions").getContext("2d")).Doughnut(doughnutChart.data.conversions, doughnutChart.options);

        Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= value %>%";

        var DoughnutChartVisitors = new Chart(document.getElementById("visitors").getContext("2d")).Pie(doughnutChart.data.visitors, doughnutChart.options);
        var DoughnutChartVisitors_impressions = new Chart(document.getElementById("visitors-impressions").getContext("2d")).Pie(doughnutChart.data.visitors_impressions, doughnutChart.options);
        var DoughnutChartVisitors_conversions = new Chart(document.getElementById("visitors-conversions").getContext("2d")).Pie(doughnutChart.data.visitors_conversions, doughnutChart.options);

        legend = DoughnutChartImpressions.generateLegend();
        jQuery('#doughnut-impressions').after(legend);

        legend = DoughnutChartConversions.generateLegend();
        jQuery('#doughnut-conversions').after(legend);

        legend = DoughnutChartVisitors.generateLegend();
        jQuery('#visitors').after(legend);

        legend = DoughnutChartVisitors_conversions.generateLegend();
        jQuery('#visitors-conversions').after(legend);

        legend = DoughnutChartVisitors_impressions.generateLegend();
        jQuery('#visitors-impressions').after(legend);


        jQuery('#plus').on('click', function () {
            var filter = jQuery('#filter-plus');
            if (filter.is(':visible')) {
                filter.hide(200);
                jQuery(this).html('<?php _e("Plus de filtres", 'easy-form'); ?>');

            } else {
                filter.show(200);
                jQuery(this).html('<?php _e("Moins de filtres", 'easy-form'); ?>');
            }
        });


    </script>
<?php else : ?>
<?php endif; ?>
</div>
<?php if (!defined('ABSPATH')) exit; // Exit if accessed directly ?>
<!--
@Updated : V 0.5.5
-->
<div class="wrap">
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
                <?php if (isset($imps['custom_datas']) && is_array($imps['custom_datas'])) { ?>
                    <div class="col-sm-3">
                        <label for="form-id"><?php _e("Tri customisé", 'easy-form'); ?></label>
                        <select name="custom_data" id="form-id">
                            <option value=""><?php _e("Séléctionnez une valeur", 'easy-form'); ?></option>
                            <?php /** @var WP_Post $oneForm * */
                            foreach ($imps['custom_datas'] as $data) { ?>
                                <option <?php echo $data == $_GET['custom_data'] ? 'selected' : ''; ?>
                                    value="<?php echo $data; ?>"><?php echo $data; ?></option>
                            <?php } ?>
                        </select>
                    </div>
                <?php } ?>
            </div>
            <input type="hidden" name="page" value="<?php echo $_GET['page']; ?>">
            <div id="filter-plus" style="display: none;">
                <div class="row mg-top-25">
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
                                value="months" <?php echo isset($_GET['groupby']) && $_GET['groupby'] == 'months' ? 'selected' : ''; ?> ><?php _e("Mois", 'easy-form'); ?></option>
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
            <div class="tab-head panel-wordpress panel-blue datas same-height" data-height-id="1">
                <div class="head">
                    <h2><?php _e("Taux de conversion", 'easy-form'); ?></h2>
                </div>
                <i class="fa fa-area-chart"></i>
                <h3 class="bigtitle"><?php echo $imps['total'] != 0 ? number_format(($convs['total'] / $imps['total']) * 100, 2) : '-'; ?>
                    <span>%</span></h3>
                <div class="row"></div>
            </div>
        </div>
        <div class="col-sm-4 col-md-3">
            <div class="tab-head panel-wordpress panel-red datas same-height" data-height-id="1">
                <div class="head">
                    <h2><?php _e("Nombre d'impression", 'easy-form'); ?></h2>
                </div>
                <i class="fa fa-eye"></i>
                <h3 class="bigtitle"><?php echo $imps['total']; ?><span><?php _e("vues", 'easy-form'); ?></span></h3>
                <div class="row"></div>
            </div>
        </div>
        <div class="col-sm-4 col-md-3">
            <div class="tab-head panel-wordpress panel-green datas same-height" data-height-id="1">
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
            <div class="tab-head panel-wordpress panel-yellow datas same-height" data-height-id="1">
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
            <div class="data panel-wordpress same-height" data-height-id="2">
                <div class="head">
                    <h2><?php _e("Impression et conversions", 'easy-form'); ?></h2>
                </div>
                <canvas id="lines" width="30" height="9"></canvas>
            </div>
        </div>
        <div class="col-sm-3">
            <div class="data panel-wordpress same-height" data-height-id="2">
                <div class="head">
                    <h2><?php _e("Appareils", 'easy-form'); ?></h2>
                </div>
                <p><?php _e("Types d'appareils utilisés", 'easy-form'); ?></p>
                <canvas id="devices" width="300" height="300"></canvas>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-3">
            <div class="data panel-wordpress same-height" data-height-id="3">
                <div class="head">
                    <h2><?php _e("Type de visiteurs total", 'easy-form'); ?></h2>
                </div>
                <p><?php _e("Taux de visiteurs pour les impressions et les conversions", 'easy-form'); ?></p>
                <canvas id="visitors" width="300" height="300"></canvas>
            </div>
        </div>
        <div class="col-sm-9">
            <div class="data panel-wordpress same-height" data-height-id="3">
                <div class="head">
                    <h2><?php _e("Provenance des utilisateurs", 'easy-form'); ?></h2>
                </div>
                <div class="row">
                    <div class="col-sm-9">
                        <div id="world-map" style="width: 100%; height: 335px;"></div>
                    </div>
                    <div class="col-sm-3">
                        <table class="table table-hover table-overflow table-condensed">
                            <thead>
                            <tr>
                                <th><?php _e("Région", 'easy-form'); ?></th>
                                <th><?php _e("Visiteurs", 'easy-form'); ?></th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($imps['regions'] as $region => $nb) { ?>
                                <tr>
                                    <td><?php echo $region; ?></td>
                                    <td><?php echo $nb; ?></td>
                                </tr>
                            <?php } ?>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
            <div class="data panel-wordpress" style="height: 380px;">
                <div class="head">
                    <form action="#" target="_blank">
                        <h2><?php _e("Détail des visiteurs", 'easy-form'); ?>
                            <?php if (is_array($_GET)) foreach ($_GET as $key => $val) { ?>
                                <input type="hidden" name="<?php echo $key; ?>" value="<?php echo $val; ?>">
                            <?php } ?>
                            <input type="hidden" name="noheader" value="true">
                            <input type="hidden" name="download_as_csv" value="true">
                            <input type="submit" formtarget="_blank" value="<?php _e("Télécharger au format CSV", 'easy-form'); ?>" class="page-title-action"/>
                        </h2>
                    </form>
                </div>
                <table class="table sortable table-hover table-condensed table-overflow">
                    <thead>
                    <tr>
                        <th><?php _e("Dernière visite", 'easy-form'); ?></th>
                        <th><?php _e("Adresse IP", 'easy-form'); ?></th>
                        <th><?php _e("Région", 'easy-form'); ?></th>
                        <th><?php _e("Appareil", 'easy-form'); ?></th>
                        <th><?php _e("Champ Personnalisé", 'easy-form'); ?></th>
                        <th><?php _e("Nombre de visites", 'easy-form'); ?></th>
                        <th><?php _e("Conversion", 'easy-form'); ?></th>
                    </tr>
                    </thead>
                    <tbody>

                    <?php $devices = [
                        FormWordpress::_DESKTOP => '<i class="fa fa-desktop" ></i>',
                        FormWordpress::_MOBILE => '<i class="fa fa-mobile"></i>',
                        FormWordpress::_TABLET => '<i class="fa fa-tablet"></i>',
                    ]; ?>


                    <?php $conversion = [
                        FormPlugin::_CONVERSION_MISSED => __('<i class="fa fa-times red-txt" title="Aucune conversion" ></i>', 'easy-form'),
                        FormPlugin::_CONVERSION_PART => __('<i class="fa fa-circle orange-txt" title="Conversion effectuée sur un autre mot clé"></i>', 'easy-form'),
                        FormPlugin::_CONVERSION_DONE => __('<i class="fa fa-check green-txt" title="Conversion effectuée"></i>', 'easy-form'),
                    ]; ?>

                    <?php foreach ($tabData as $data) { ?>
                        <tr>
                            <td><?php echo $data['date']; ?></td>
                            <td><?php echo $data['ip']; ?></td>
                            <td><?php echo $data['location']; ?></td>
                            <td><?php echo $devices[$data['device']]; ?></td>
                            <td><?php echo $data['custom_data']; ?></td>
                            <td><?php echo $data['nb_impression']; ?></td>
                            <td><?php echo $conversion[$data['conversion']]; ?></td>
                        </tr>
                    <?php } ?>
                    </tbody>
                </table>
                <div class="clearfix"></div>
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
                /*    conversions: [
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
                 ], */
                total: [
                    {
                        value: <?php echo $imps['devices']['mobile'] + $convs['devices']['mobile']; ?>,
                        color: "#F7464A",
                        highlight: "#FF5A5E",
                        label: "<?php _e("Mobile", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $imps['devices']['tablet'] + $convs['devices']['tablet'];  ?>,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",
                        label: "<?php _e("Tablette", 'easy-form'); ?>"
                    },
                    {
                        value: <?php echo $imps['devices']['desktop'] + $convs['devices']['desktop']; ?>,
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
                /*    visitors_impressions: [
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
                 ], */
            },
            options: {
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
            }
        };


        // Impression & conversions
        //  var DoughnutChartImpressions = new Chart(document.getElementById("doughnut-impressions").getContext("2d")).Doughnut(doughnutChart.data.impressions, doughnutChart.options);
        //  var DoughnutChartConversions = new Chart(document.getElementById("doughnut-conversions").getContext("2d")).Doughnut(doughnutChart.data.conversions, doughnutChart.options);
        var DevicesChart = new Chart(document.getElementById("devices").getContext("2d")).Doughnut(doughnutChart.data.total, doughnutChart.options);
        Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= value %>%";
        var VisitorsChart = new Chart(document.getElementById("visitors").getContext("2d")).Pie(doughnutChart.data.visitors, doughnutChart.options);

        // Display legends
        legend = DevicesChart.generateLegend();
        jQuery('#devices').after(legend);

        legend = VisitorsChart.generateLegend();
        jQuery('#visitors').after(legend);

        /*
         legend = DoughnutChartImpressions.generateLegend();
         jQuery('#doughnut-impressions').after(legend);

         legend = DoughnutChartConversions.generateLegend();
         jQuery('#doughnut-conversions').after(legend); */


        /*
         var DoughnutChartVisitors_impressions = new Chart(document.getElementById("visitors-impressions").getContext("2d")).Pie(doughnutChart.data.visitors_impressions, doughnutChart.options);
         var DoughnutChartVisitors_conversions = new Chart(document.getElementById("visitors-conversions").getContext("2d")).Pie(doughnutChart.data.visitors_conversions, doughnutChart.options);


         legend = DoughnutChartVisitors_conversions.generateLegend();
         jQuery('#visitors-conversions').after(legend);

         legend = DoughnutChartVisitors_impressions.generateLegend();
         jQuery('#visitors-impressions').after(legend); */


        jQuery(function () {

            jQuery('#world-map').vectorMap({
                map: 'world_mill_en',
                normalizeFunction: 'polynomial',
                hoverOpacity: 0.7,
                hoverColor: false,
                backgroundColor: 'transparent',
                regionStyle: {
                    initial: {
                        fill: 'rgba(210, 214, 222, 1)',
                        "fill-opacity": 1,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 1
                    },
                    hover: {
                        "fill-opacity": 0.7,
                        cursor: 'pointer'
                    },
                    selected: {
                        fill: 'yellow'
                    },
                    selectedHover: {}
                },
                markerStyle: {
                    initial: {
                        fill: '#9BC11E',
                        stroke: 'none'
                    }
                },
                markers: [
                    <?php if(is_array($imps)) foreach($imps['ips'] as $ip){
                    if($ip['lat'] != 0 && $ip['lng'] != 0) {
                    ?>
                    {
                        latLng: [<?php echo $ip['lat']; ?>,<?php echo $ip['lng']; ?>],
                        name: '<?php echo $ip['region']; ?> (<?php echo $imps['regions'][$ip['region']]; ?>)'
                    },
                    <?php } } ?>
                ]
            });


        });

        function viewport() {
            var e = window, a = 'inner';
            if (!('innerWidth' in window )) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {width: e[a + 'Width'], height: e[a + 'Height']};
        }

        jQuery(document).ready(sameHeight);
        jQuery(window).resize(sameHeight);

        function sameHeight() {
            if (viewport().width > 768) {
                var atts = 3;
                for (var i = 1; i <= atts; i++) {
                    var maxheight = 0;
                    jQuery('.same-height[data-height-id="' + i + '"]')
                        .each(function () {
                            jQuery(this).attr('style', '');
                            maxheight = Math.max(maxheight, jQuery(this).height())
                        }).each(function () {
                        jQuery(this).height(maxheight)
                    });
                }
            } else {
                jQuery('.same-height').each(function () {
                    jQuery(this).attr('style', '');
                });
            }
        }


    </script>
<?php endif; ?>
<script type="text/javascript">
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
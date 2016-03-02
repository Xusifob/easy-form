<button id="button">Launch</button>


<script type="text/javascript">

    var $ = jQuery;

    $('#button').on('click',function(){
        var impressions = <?php echo json_encode($impressions); ?>;

        for(var i=0;i<impressions.length;i++){
            // Delete the impression

            // Get the data
        }
    })


    function update_stats(){

        $.get('http://ip-api.com/json/',impression.id).then(function(data){
            var dat = {
                lng : data.lon,
                lat : data.lat,
                region : data.city + ' - ' + data.country,
                number : 1,
            }
        })
      /*  $geoplugin = json_decode(file_get_contents('http://ip-api.com/json/' . $_SERVER['REMOTE_ADDR']), true);

        $data = [
            'lng' => is_numeric($geoplugin['lon']) ? $geoplugin['lon'] : 0,
            'lat' => is_numeric($geoplugin['lat']) ? $geoplugin['lat'] : 0,
            'region' => $geoplugin['city'] . ' - ' . $geoplugin['country'],
            'number' => 1
    ]; */
    }
</script>

<?php die(); ?>
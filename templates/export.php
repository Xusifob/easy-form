<div class="wrap gf_browser_chrome">
    <h2>Exporter un formulaire</h2>
    <section class="panel-wordpress">
        <div class="form-group">
            <div class="form-group">
                <h2>Choisir les formulaires à exporter</h2>
                <p>Les IDs des formulaires ne seront pas exportés, ils seront ajoutés comme de nouveaux posts pour éviter tout conflit</p>
            </div>
        </div>
        <form action="#" method="post">
            <?php while($my_query->have_posts()): $my_query->the_post(); ?>
                <div class="form-group">
                    <input type="checkbox" name="forms[]" id="<?php the_ID(); ?>"  value="<?php the_ID(); ?>">
                    <label for="<?php the_ID(); ?>" class="label-checkbox"><?php the_title(); ?></label>
                </div>
            <?php endwhile; ?>
            <div class="form-group">
                <input type="submit" class="button button-primary button-large" name="export-forms-bastien" value="Exporter"/>
            </div>
        </form>
        <?php if($downloadButton): ?>
            <hr>
            <h2>Formulaires exportés</h2>
            <?php echo $downloadButton; ?>
        <?php endif; ?>
    </section>
</div>
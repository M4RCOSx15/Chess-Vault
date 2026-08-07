package com.example.chessvault.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
public class VideoRequestDTO {

    private String url;
    private String titulo;
    @JsonProperty("Thumbnail") // @JsonProperty garante que o Jackson leia "Thumbnail" (maiúsculo) do JSON
    private String thumbnail;
    private String canal;
    private String idVideo;

    public VideoRequestDTO() {}

    public VideoRequestDTO(String url, String titulo, String thumbnail, String canal, String idVideo) {
        this.url       = url;
        this.titulo    = titulo;
        this.thumbnail = thumbnail;
        this.canal     = canal;
        this.idVideo   = idVideo;
    }

    public String getUrl()              { return url; }
    public void   setUrl(String url)    { this.url = url; }

    public String getTitulo()              { return titulo; }
    public void   setTitulo(String titulo) { this.titulo = titulo; }

    // Getter/setter com nome limpo — o @JsonProperty cuida do mapeamento JSON
    public String getThumbnail()                { return thumbnail; }
    public void   setThumbnail(String thumbnail){ this.thumbnail = thumbnail; }

    // Alias para retrocompatibilidade com código legado que chamava getTumbnail()
    public String getTumbnail() { return thumbnail; }

    public String getCanal()              { return canal; }
    public void   setCanal(String canal)  { this.canal = canal; }

    public String getIdVideo()               { return idVideo; }
    public void   setIdVideo(String idVideo) { this.idVideo = idVideo; }
}

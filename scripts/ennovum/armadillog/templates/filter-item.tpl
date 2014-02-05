<div class="filter-item" data-view-element="el">
    <div class="filter-affect-box">
        <div class="filter-affect-type-list" data-view-element="affectTypeListEl">
            <select id="filter-{{id}}-affect-type-radio" name="filter-{{id}}-affect-type-radio" class="selectinput filter-affect-type-select" data-view-element="affectTypeListSelectEl">
                {{#each filterAffectTypes}}
                <option id="filter-{{../id}}-affect-type-option-{{this.value}}" value="{{this.value}}" class="filter-affect-type-option">{{this.label}}</option>
                {{/each}}
            </select>
        </div>
    </div>
    <div class="filter-search-box">
        <textarea id="filter-{{id}}-value" type="text" class="textinput filter-value-input" data-view-element="valueInputEl"></textarea>
        <div class="filter-value-type-list" data-view-element="valueTypeListEl">
            <select id="filter-{{id}}-value-type-radio" name="filter-{{id}}-value-type-radio" class="selectinput filter-value-type-select" data-view-element="valueTypeListSelectEl">
                {{#each filterValueTypes}}
                <option id="filter-{{../id}}-value-type-option-{{this.value}}" value="{{this.value}}" class="filter-value-type-option">{{this.label}}</option>
                {{/each}}
            </select>
        </div>
    </div>
    <div class="filter-highlight-box">
        <div class="filter-highlight-type-list highlight-demo" data-view-element="highlightTypeListEl">
            <select id="filter-{{id}}-highlight-type-radio" name="filter-{{id}}-highlight-type-radio" class="selectinput filter-highlight-type-select" data-view-element="highlightTypeListSelectEl">
                {{#each filterHighlightTypes}}
                <option id="filter-{{../id}}-highlight-type-option-{{this.value}}" value="{{this.value}}" class="filter-highlight-type-option {{this.class}}" selected-class="{{this.class}}"><span>{{this.label}}</span></option>
                {{/each}}
            </select>
        </div>
    </div>
    <div class="filter-action-list">
        <a class="button button-inline filter-action filter-mute" data-view-element="muteEl">
            <span class="button-icon"></span>
            <span class="button-label">Mute</span>
        </a>
        <a class="button button-inline filter-action filter-unmute" data-view-element="unmuteEl">
            <span class="button-icon"></span>
            <span class="button-label">Unmute</span>
        </a>
        <a class="button button-inline filter-action filter-remove" data-view-element="removeEl">
            <span class="button-icon"></span>
            <span class="button-label">Remove</span>
        </a>
        <a class="button button-inline filter-action filter-move-up" data-view-element="moveUpEl">
            <span class="button-icon"></span>
            <span class="button-label">Move up</span>
        </a>
        <a class="button button-inline filter-action filter-move-down" data-view-element="moveDownEl">
            <span class="button-icon"></span>
            <span class="button-label">Move down</span>
        </a>
    </div>
</div>

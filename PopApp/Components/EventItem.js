/* eslint-disable import/no-cycle */
import React from 'react';
import {
  StyleSheet, View, Text, FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Spacing } from '../Styles';
import PROPS_TYPE from '../res/Props';
import MeetingEvent from './MeetingEvent';
import DiscussionEvent from './DiscussionEvent';
import PollEvent from './PollEvent';
import RollCallEvent from './RollCallEvent';
import OrganizationNameProperty from './OrganizationNameProperty';
import WitnessProperty from './WitnessProperty';
import RollCallEventOrganizer from './RollCallEventOrganizer';
import { getStore } from '../Store/configureStore';
/**
 * The Event item component: display the correct representation of the event according to its type,
 * otherwise display its name and in all cases its nested events
*/
const styles = StyleSheet.create({
  view: {
    marginHorizontal: Spacing.s,
  },
  text: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
  },
});

const EventItem = ({ event, lao }) => {
  const { pubKey } = getStore().getState().keypairReducer;
  const isOrganizer = lao.organizer === pubKey;

  switch (event.object) {
    case 'meeting':
      return (<MeetingEvent event={event} />);
    case 'roll-call':
      if (isOrganizer) {
        return (<RollCallEventOrganizer event={event} />);
      }
      return (<RollCallEvent event={event} />);
    case 'poll':
      return (<PollEvent event={event} />);
    case 'discussion':
      return (<DiscussionEvent event={event} />);
    case 'organization_name':
      return (<OrganizationNameProperty event={event} />);
    case 'witness':
      return (<WitnessProperty event={event} />);
    default:
      return (
        <View style={styles.view}>
          <Text style={styles.text}>{event.name}</Text>
          <FlatList
            data={event.childrens}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EventItem event={item} />}
            listKey={`EventItem-${event.id.toString()}`}
          />
        </View>
      );
  }
};

EventItem.propTypes = {
  event: PropTypes.oneOfType([PROPS_TYPE.event, PROPS_TYPE.property]).isRequired,
  lao: PROPS_TYPE.LAO.isRequired,
};

const mapStateToProps = (state) => ({
  lao: state.currentLaoReducer.lao,
});

export default connect(mapStateToProps)(EventItem);

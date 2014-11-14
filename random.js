/* This is the multiply-with-carry (MWC) random generator with
 * a pretty long period. Adapted from Wikipedia, see
 * http://en.wikipedia.org/wiki/Random_number_generation#Computational_methods
 */
var m_w = Math.round(Math.random()*1e10);
var m_z = 987654321;
var mask = 0xffffffff;
/** 
* seed: Takes any integer as seed
*/
module.exports.seed = function(s) {
    m_w = s;
}
/**
* random: Returns number between 0 (inclusive) and 1.0 (exclusive),
* just like Math.random()
*/
module.exports.random = function() {
  m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
  m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
  var result = ((m_z << 16) + m_w) & mask;
  result /= 4294967296;
  return result + 0.5;
}

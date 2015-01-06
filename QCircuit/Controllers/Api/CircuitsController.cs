using QCircuit.Models;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;

namespace QCircuit.Controllers.Api
{
    [Authorize]
    public class CircuitsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Circuits
        public IQueryable<SavedCircuit> GetCircuits()
        {
            return db.Circuits.Where(c => c.UserId == db.User.Id);
        }

        // GET: api/Circuits/5
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult GetSavedCircuit(Guid id)
        {
            SavedCircuit savedCircuit = db.Circuits.Find(id);
            if (savedCircuit == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(savedCircuit.UserId) || savedCircuit.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            savedCircuit.SerializeChildren = true;
            return Ok(savedCircuit);
        }

        // PUT: api/Circuits/5
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult PutSavedCircuit(Guid id, SavedCircuit savedCircuit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != savedCircuit.Id)
            {
                return BadRequest();
            }

            SavedCircuit existingCircuit = db.Circuits.Find(id);
            if (string.IsNullOrEmpty(existingCircuit.UserId) || existingCircuit.UserId != db.User.Id)
            {
                return Unauthorized();
            }
            
            if (savedCircuit.Name != existingCircuit.Name)
            {
                db.Entry(existingCircuit).CurrentValues.SetValues(new
                {
                    Name = savedCircuit.Name
                });
            }

            var existingGates = existingCircuit.Slots.SelectMany(s => s.Gates).ToList();
            var savedGates = savedCircuit.Slots.SelectMany(s => s.Gates);

            db.GateInstances.RemoveRange(existingGates.Where(e => !savedGates.Any(s => s.Id == e.Id)));
            foreach (var savedGate in savedGates.Where(s => existingGates.Any(e => e.Id == s.Id)))
            {
                var existingGate = db.GateInstances.Find(savedGate.Id);

                if (savedGate.Position != existingGate.Position)
                {
                    db.Entry(existingGate).CurrentValues.SetValues(new
                    {
                        Position = savedGate.Position
                    });
                }
            }

            var existingSlots = existingCircuit.Slots.ToList();
            var savedSlots = savedCircuit.Slots;

            foreach (var savedSlot in savedSlots)
            {
                savedSlot.CircuitId = id;
            }

            db.CircuitSlots.RemoveRange(existingSlots.Where(e => !savedSlots.Any(s => s.Id == e.Id)));
            db.CircuitSlots.AddRange(savedSlots.Where(s => !existingSlots.Any(e => e.Id == s.Id)));
            foreach (var savedSlot in savedSlots.Where(s => existingSlots.Any(e => e.Id == s.Id)))
            {
                var existingSlot = db.CircuitSlots.Find(savedSlot.Id);

                if (savedSlot.SlotNumber != existingSlot.SlotNumber)
                {
                    db.Entry(existingSlot).CurrentValues.SetValues(new
                    {
                        SlotNumber = savedSlot.SlotNumber
                    });
                }

                foreach (var existingGate in existingSlot.Gates.Where(e => !savedSlot.Gates.Any(s => s.Id == e.Id)).ToList())
                {
                    existingSlot.Gates.Remove(existingGate);
                    db.Entry(existingSlot).State = EntityState.Modified;
                }
                foreach (var savedGate in savedSlot.Gates.Where(s => !existingSlot.Gates.Any(e => e.Id == s.Id)))
                {
                    var existingGate = existingGates.SingleOrDefault(e => e.Id == savedGate.Id);

                    if (existingGate == null) existingSlot.Gates.Add(savedGate);
                    else existingSlot.Gates.Add(existingGate);

                    db.Entry(existingSlot).State = EntityState.Modified;
                }
            }

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SavedCircuitExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            existingCircuit.SerializeChildren = true;
            return Ok(existingCircuit);
        }

        // POST: api/Circuits
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult PostSavedCircuit(SavedCircuit savedCircuit)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            savedCircuit.UserId = db.User.Id;
            db.Circuits.Add(savedCircuit);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (SavedCircuitExists(savedCircuit.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            savedCircuit.SerializeChildren = true;
            return CreatedAtRoute("DefaultApi", new { id = savedCircuit.Id }, savedCircuit);
        }

        // POST: api/Circuits/5
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult PostSavedCircuit(Guid id)
        {
            SavedCircuit savedCircuit = db.Circuits
                .AsNoTracking()
                .Include(c => c.Slots)
                .Include(c => c.Slots.Select(s => s.Gates))
                .FirstOrDefault(c => c.Id == id);

            if (savedCircuit == null)
            {
                return NotFound();
            }

            savedCircuit.UserId = db.User.Id;
            db.Circuits.Add(savedCircuit);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (SavedCircuitExists(savedCircuit.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            savedCircuit.SerializeChildren = true;
            return CreatedAtRoute("DefaultApi", new { id = savedCircuit.Id }, savedCircuit);
        }

        // DELETE: api/Circuits/5
        [ResponseType(typeof(SavedCircuit))]
        public IHttpActionResult DeleteSavedCircuit(Guid id)
        {
            SavedCircuit savedCircuit = db.Circuits.Find(id);
            if (savedCircuit == null)
            {
                return NotFound();
            }

            if (string.IsNullOrEmpty(savedCircuit.UserId) || savedCircuit.UserId != db.User.Id)
            {
                return Unauthorized();
            }

            db.GateInstances.RemoveRange(savedCircuit.Slots.SelectMany(s => s.Gates));
            db.Circuits.Remove(savedCircuit);
            db.SaveChanges();

            savedCircuit.SerializeChildren = true;
            return Ok(savedCircuit);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool SavedCircuitExists(Guid id)
        {
            return db.Circuits.Any(c => c.Id == id);
        }
    }
}